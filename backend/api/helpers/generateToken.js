import JWT from 'jsonwebtoken';
const generateToken = async (payload,expiry) => {
	try {
    const token = await JWT.sign(
      //payload
      payload,

      //secret key
      process.env.JWT_KEY,

      //expiration time
      {
        expiresIn: expiry,
      }
    );

    return token;
  } catch (error) {
		console.log(error);
    return error;
  }
}

export default generateToken;