const passport = require('passport');
const User = require('../../model/User');
const GoogleStartegy = require('passport-google-oauth2').Strategy;

//serilaize
passport.serializeUser((user, done) => {
	done(null, user);
});

//deserialize
passport.deserializeUser((user, done) => {
	done(null, user);
});

//constant values
const {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	CALLBACK_URL,
} = require('../../keys/keys');

//google strategy passport.js
passport.use(
	new GoogleStartegy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const fetchedUser = await User.findOne({
					email: profile.emails[0].value,
				});

				if (fetchedUser) {
					return done(null, fetchedUser);
				}
				const createdUser = await User.create({
					email: profile.emails ? profile.emails[0].value : '',
					username: profile.displayName,
					profilePicture: profile.photos[0].value,
				});
				done(null, createdUser);
			} catch (err) {
				done(err);
			}
			return done(null, profile);
		}
	)
);
