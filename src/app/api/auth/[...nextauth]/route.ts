import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        // Add your own logic here to find the user from the credentials.
        // The credentials object will have the properties defined in the
        // credentials option. For example, credentials.username.
        // You can return a user object or null.
        const users = [
          { id: '1', name: 'J Smith', email: 'jsmith@example.com', password: 'password' },
        ];

        const user = users.find(
          (user) =>
            user.name === credentials.username &&
            user.password === credentials.password
        );

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the
          // user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST }; 