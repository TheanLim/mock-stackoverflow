const validateLoggedIn = require('../middleware/validateLoggedIn');

describe('validateLoggedIn middleware', () => {
    it('should call next() if user is already logged in', () => {
        const req = {session:{user:"0000fff"}};
        const res = {};
        const next = jest.fn(); // Mock next() function
        validateLoggedIn(req, res, next);
        expect(next).toHaveBeenCalled();
    })

    it('should send a 401 Unauthorized response if user is not logged in', () => {
        const req = {session:{}};
        const res = {status: jest.fn().mockReturnThis(), json:jest.fn()};
        const next = jest.fn(); // Mock next() function
        validateLoggedIn(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    })
})