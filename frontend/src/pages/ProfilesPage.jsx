import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';

const ProfilesPage = () => {
  const { userData, reload } = useApp();

  if (!userData) return null;

  const selectProfile = async (profileId) => {
    await api.setActiveProfile(profileId);
    await reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 pt-20">
      <div className="w-full max-w-3xl text-center">
        <h1 className="mb-8 text-4xl font-semibold">Who&apos;s watching?</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {userData.profiles?.map((profile) => (
            <button
              key={profile.id}
              onClick={() => selectProfile(profile.id)}
              className={`rounded-lg border p-6 text-4xl transition ${
                userData.activeProfile === profile.id ? 'border-netflixRed bg-zinc-900' : 'border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <div>{profile.avatar}</div>
              <p className="mt-2 text-sm">{profile.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilesPage;
