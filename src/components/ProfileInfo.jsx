/* eslint-disable react/prop-types */
const ProfileInfo = ({ userProfile }) => {
  return (
    <div className="flex items-center justify-center gap-5">
      {userProfile?.imageUrl && (
        <img
          src={userProfile.imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mt-4 mx-auto"
        />
      )}
      <p className="text-lg">
        <strong className="font-semibold">Name:</strong> {userProfile?.name}
      </p>
      <p className="text-lg">
        <strong className="font-semibold">Email:</strong> {userProfile?.email}
      </p>
    </div>
  );
};

export default ProfileInfo;
