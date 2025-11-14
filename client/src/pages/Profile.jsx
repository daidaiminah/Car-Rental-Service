import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaEdit,
  FaEnvelope,
  FaKey,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  selectCurrentUser,
  updateUser as updateUserState,
} from '../store/features/auth/authSlice';
import {
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '../store/features/users/usersApiSlice';
import OwnerDashboard from '../components/OwnerDashboard';
import RenterDashboard from '../components/RenterDashboard';
import { getApiBaseUrl } from '../utils/socketEnv';

const FALLBACK_AVATAR =
  'https://via.placeholder.com/160?text=Profile';

const exposedFields = ['name', 'phone', 'address', 'city', 'country'];

const API_BASE_URL = getApiBaseUrl();
const API_ROOT_URL = API_BASE_URL.replace(/\/api$/, '');

const normaliseImagePath = (raw) => {
  if (!raw) return FALLBACK_AVATAR;
  if (raw.startsWith('data:') || raw.startsWith('http')) return raw;

  const normalisedPath = raw.startsWith('/') ? raw : `/${raw}`;
  return `${API_ROOT_URL}${normalisedPath}`;
};

const Profile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectCurrentUser);

  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profileImage: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const {
    data: fetchedProfile,
    isLoading: profileLoading,
    isFetching: profileFetching,
    error: profileError,
    refetch: refetchProfile,
  } = useGetUserProfileQuery(authUser?.id, {
    skip: !authUser?.id,
  });

  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateUserProfileMutation();
  const [changePassword, { isLoading: passwordLoading }] =
    useChangePasswordMutation();

  useEffect(() => {
    if (fetchedProfile) {
      setProfileForm({
        name: fetchedProfile.name || '',
        email: fetchedProfile.email || '',
        phone: fetchedProfile.phone || '',
        address: fetchedProfile.address || '',
        city: fetchedProfile.city || '',
        country: fetchedProfile.country || '',
        profileImage: fetchedProfile.profileImage || '',
      });
    }
  }, [fetchedProfile]);

  const profileImageSrc = useMemo(
    () => normaliseImagePath(profileForm.profileImage),
    [profileForm.profileImage],
  );

  const loading = profileLoading || profileFetching || updateLoading || passwordLoading;

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handlePasswordInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm((prev) => ({
        ...prev,
        profileImage: reader.result?.toString() || prev.profileImage,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleProfileSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!fetchedProfile) {
        toast.error('Profile data is not ready yet. Please try again.');
        return;
      }

      const formData = new FormData();
      let hasChanges = false;

      exposedFields.forEach((field) => {
        const originalValue = fetchedProfile[field] ?? '';
        const nextValue = profileForm[field] ?? '';
        if (nextValue !== originalValue) {
          formData.append(field, nextValue);
          hasChanges = true;
        }
      });

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.info('No changes detected.');
        return;
      }

      try {
        const response = await updateProfile(formData).unwrap();
        const updatedUser = response?.data || response;

        if (updatedUser) {
          setProfileForm((prev) => ({
            ...prev,
            ...exposedFields.reduce(
              (acc, key) => ({
                ...acc,
                [key]: updatedUser[key] ?? prev[key] ?? '',
              }),
              {},
            ),
            profileImage: updatedUser.profileImage || prev.profileImage,
          }));
          dispatch(updateUserState(updatedUser));
        }

        setProfileImageFile(null);
        setEditMode(false);
        await refetchProfile();
        toast.success('Profile updated successfully.');
      } catch (error) {
        const message =
          error?.data?.message ||
          error?.data?.errors?.[0]?.msg ||
          'Failed to update profile. Please try again.';
        toast.error(message);
      }
    },
    [dispatch, fetchedProfile, profileForm, profileImageFile, refetchProfile, updateProfile],
  );

  const handlePasswordSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('New passwords do not match.');
        return;
      }

      try {
        await changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }).unwrap();

        toast.success('Password changed successfully.');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
      } catch (error) {
        const message =
          error?.data?.message ||
          error?.data?.errors?.[0]?.msg ||
          'Failed to change password. Please verify your current password.';
        toast.error(message);
      }
    },
    [changePassword, passwordForm],
  );

  if (!authUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-secondary-dark">
          Please sign in to view your profile.
        </h1>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-md border border-red-300 bg-red-50 px-6 py-4 text-red-700">
          <h2 className="text-lg font-semibold">Unable to load profile</h2>
          <p className="text-sm">
            {profileError?.data?.message ||
              'Please refresh the page or try again later.'}
          </p>
        </div>
      </div>
    );
  }

  if (profileLoading && !fetchedProfile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-secondary-dark">
        My Profile
      </h1>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="flex flex-col items-center justify-between bg-secondary-dark p-6 md:flex-row">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-200 md:mb-0 md:mr-6">
              <img
                src={profileImageSrc}
                alt={profileForm.name || 'Profile'}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <FaUser />
                <span>{profileForm.name || 'Unnamed user'}</span>
              </h2>
              <p className="text-gray-300">
                {fetchedProfile?.role === 'customer'
                  ? 'Renter'
                  : fetchedProfile?.role || 'User'}
              </p>
              {fetchedProfile?.createdAt && (
                <p className="text-gray-300">
                  Member since{' '}
                  {new Date(fetchedProfile.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="btn-primary flex items-center gap-2"
              disabled={loading}
            >
              <FaEdit />
              <span>{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!editMode && (
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-md border border-gray-200 p-4">
                <h3 className="mb-4 text-lg font-semibold text-secondary-dark">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-primary" />
                    <div>
                      <p className="text-sm text-secondary">Email</p>
                      <p className="font-medium text-secondary-dark">
                        {profileForm.email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-primary" />
                    <div>
                      <p className="text-sm text-secondary">Phone</p>
                      <p className="font-medium text-secondary-dark">
                        {profileForm.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-gray-200 p-4">
                <h3 className="mb-4 text-lg font-semibold text-secondary-dark">
                  Address
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-primary" />
                    <div>
                      <p className="text-sm text-secondary">Address</p>
                      <p className="font-medium text-secondary-dark">
                        {profileForm.address || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-primary" />
                    <div>
                      <p className="text-sm text-secondary">City</p>
                      <p className="font-medium text-secondary-dark">
                        {profileForm.city || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-primary" />
                    <div>
                      <p className="text-sm text-secondary">Country</p>
                      <p className="font-medium text-secondary-dark">
                        {profileForm.country || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {authUser?.role === 'owner' && !editMode && (
            <OwnerDashboard userId={authUser.id} />
          )}
          {authUser?.role === 'customer' && !editMode && (
            <RenterDashboard userId={authUser.id} />
          )}

          {editMode ? (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col text-sm font-medium text-secondary-dark">
                  Full Name
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleInputChange}
                    className="mt-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </label>

                <div>
                  <p className="text-sm font-medium text-secondary-dark">
                    Email Address
                  </p>
                  <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                    {profileForm.email}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed.
                  </p>
                </div>

                <label className="flex flex-col text-sm font-medium text-secondary-dark">
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleInputChange}
                    className="mt-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>

                <label className="flex flex-col text-sm font-medium text-secondary-dark">
                  Address
                  <input
                    type="text"
                    name="address"
                    value={profileForm.address}
                    onChange={handleInputChange}
                    className="mt-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>

                <label className="flex flex-col text-sm font-medium text-secondary-dark">
                  City
                  <input
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleInputChange}
                    className="mt-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>

                <label className="flex flex-col text-sm font-medium text-secondary-dark">
                  Country
                  <input
                    type="text"
                    name="country"
                    value={profileForm.country}
                    onChange={handleInputChange}
                    className="mt-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>

                <label className="flex flex-col text-sm font-medium text-secondary-dark md:col-span-2">
                  Profile Image
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setProfileImageFile(null);
                    if (fetchedProfile) {
                      setProfileForm({
                        name: fetchedProfile.name || '',
                        email: fetchedProfile.email || '',
                        phone: fetchedProfile.phone || '',
                        address: fetchedProfile.address || '',
                        city: fetchedProfile.city || '',
                        country: fetchedProfile.country || '',
                        profileImage: fetchedProfile.profileImage || '',
                      });
                    }
                  }}
                  className="btn-secondary-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-secondary-dark">
                Security
              </h3>

              {showPasswordForm ? (
                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                  <label className="block text-sm font-medium text-secondary-dark">
                    Current Password
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </label>

                  <label className="block text-sm font-medium text-secondary-dark">
                    New Password
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </label>

                  <label className="block text-sm font-medium text-secondary-dark">
                    Confirm New Password
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </label>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      className="btn-secondary-outline"
                      onClick={() => setShowPasswordForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-secondary-outline flex items-center gap-2"
                >
                  <FaKey />
                  <span>Change Password</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
