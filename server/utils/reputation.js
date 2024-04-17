const votingActionInfo = {
    upvote: {
        reputation: 15,
        voterRepChange: 0,
        postOwnerRepChange:10
    },
    downvote: {
        reputation: 125,
        voterRepChange: -2,
        postOwnerRepChange: -1
    },
    flag: {
        reputation: 15,
        voterRepChange: 0,
        postOwnerRepChange: 0
    },
    close: {
        reputation: 3000,
        voterRepChange: 0,
        postOwnerRepChange: 0
    },
    reopen: {
        reputation: 3000,
        voterRepChange: 0,
        postOwnerRepChange: 0
    },
    // Not a voteType per se, but used to handle postOwnerRepChange
    flagExceeded: {
        reputation: 0,
        voterRepChange: 0,
        postOwnerRepChange: -100
    },
    // Not a voteType per se, but fits into requirement check framework
    comment: {
        reputation: 50,
        voterRepChange: 0,
        postOwnerRepChange: 0
    },
}

const checkReputation = (user, voteType) =>{
    const requiredReputation = votingActionInfo[voteType].reputation;
    if (user.reputation >= requiredReputation) {
        return { success: true };
    } else {
        return { success: false, error: `Needs at least ${requiredReputation} reputation to ${voteType}` };
    }
}

const handleVoteReputation = async(voter, postOwner, voteType, actionType) =>{
    try {
        const validActionTypes = ['apply', 'revert'];
        if (!validActionTypes.includes(actionType)) {
            throw new Error(`Invalid action type: ${actionType}. Valid action types are: ${validActionTypes.join(', ')}`);
        }

        if (!votingActionInfo[voteType]) {
            throw new Error('Invalid vote type');
        }    

        if (actionType === 'apply'){ // only check reputation for apply actions; dont check for revert actions
            const requiredReputation = votingActionInfo[voteType].reputation;
            if (voter.reputation < requiredReputation){
                throw new Error(`Needs at least ${requiredReputation} reputation to ${voteType}`);
            }
        }

        let {voterRepChange, postOwnerRepChange} = votingActionInfo[voteType];
        if (actionType === 'revert') {
            voterRepChange *= -1
            postOwnerRepChange *= -1
        }
        voter.reputation = Math.max(voter.reputation + voterRepChange, 1);
        postOwner.reputation = Math.max(postOwner.reputation + postOwnerRepChange, 1);

        await Promise.all([voter.save(), postOwner.save()]);
    } catch (err) {
        throw new Error("Error when handling vote reputation: " + err.message);
    }
}

module.exports = { votingActionInfo, handleVoteReputation, checkReputation };
