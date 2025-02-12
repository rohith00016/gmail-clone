/* eslint-disable react/prop-types */
const AuthButton = ({
  isAuthenticated,
  handleAuthClick,
  handleSignoutClick,
}) => {
  return !isAuthenticated ? (
    <button
      onClick={handleAuthClick}
      className="w-50 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Sign in with Google
    </button>
  ) : (
    <button
      onClick={handleSignoutClick}
      className="w-50 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Sign out
    </button>
  );
};

export default AuthButton;
