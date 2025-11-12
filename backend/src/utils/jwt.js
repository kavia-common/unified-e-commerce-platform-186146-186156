'use strict';
const jwt = require('jsonwebtoken');

/**
 * JWT utility helpers for signing and verifying tokens.
 * Uses HS256 with secret from env JWT_SECRET.
 */

const JWT_ALGO = 'HS256';
const DEFAULT_EXPIRES = '7d';

// PUBLIC_INTERFACE
function signToken(payload, opts = {}) {
  /** Sign a JWT token for the given payload */
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET env variable is required');
  }
  const options = {
    algorithm: JWT_ALGO,
    expiresIn: opts.expiresIn || DEFAULT_EXPIRES,
    ...(opts.issuer ? { issuer: opts.issuer } : {}),
    ...(opts.audience ? { audience: opts.audience } : {}),
  };
  return jwt.sign(payload, secret, options);
}

// PUBLIC_INTERFACE
function verifyToken(token) {
  /** Verify a JWT token and return the decoded payload */
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET env variable is required');
  }
  return jwt.verify(token, secret, { algorithms: [JWT_ALGO] });
}

module.exports = { signToken, verifyToken };
