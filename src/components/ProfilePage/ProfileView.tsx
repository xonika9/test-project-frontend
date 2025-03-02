import { Box, Typography } from '@mui/material';
import { UserProfile } from '@/app/api/authApi';
import ProfileField from './ProfileField';

interface ProfileViewProps {
  data: UserProfile;
  editMode: boolean;
  control?: any;
  errors?: any;
}

const ProfileView = ({ data, editMode, control, errors }: ProfileViewProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ProfileField
        name="firstName"
        label="Имя"
        control={control}
        error={errors?.firstName}
        editMode={editMode}
        value={data.firstName}
      />
      
      <ProfileField
        name="lastName"
        label="Фамилия"
        control={control}
        error={errors?.lastName}
        editMode={editMode}
        value={data.lastName}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant='body1' sx={{ minWidth: 120 }}>
          Email:
        </Typography>
        <Typography>{data.email}</Typography>
      </Box>

      <ProfileField
        name="username"
        label="Логин"
        control={control}
        error={errors?.username}
        editMode={editMode}
        value={data.username}
      />

      <ProfileField
        name="phoneNumber"
        label="Телефон"
        control={control}
        error={errors?.phoneNumber}
        editMode={editMode}
        value={data.phoneNumber}
      />

      <ProfileField
        name="location"
        label="Местоположение"
        control={control}
        error={errors?.location}
        editMode={editMode}
        value={data.location}
      />

      <ProfileField
        name="language"
        label="Язык"
        control={control}
        error={errors?.language}
        editMode={editMode}
        value={data.language}
        type="select"
        selectItems={[
          { value: 'ru', label: 'Русский' },
          { value: 'en', label: 'English' },
        ]}
      />

      <ProfileField
        name="themePreference"
        label="Тема"
        control={control}
        error={errors?.themePreference}
        editMode={editMode}
        value={data.themePreference}
        type="select"
        selectItems={[
          { value: 'light', label: 'Светлая' },
          { value: 'dark', label: 'Темная' },
        ]}
      />

      <ProfileField
        name="bio"
        label="Биография"
        control={control}
        error={errors?.bio}
        editMode={editMode}
        value={data.bio}
        type="multiline"
      />

      <ProfileField
        name="avatarUrl"
        label="Аватар"
        control={control}
        error={errors?.avatarUrl}
        editMode={editMode}
        value={data.avatarUrl}
      />

      {/* Дополнительная информация */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
        <Typography variant='body2'>
          Дата регистрации: {new Date(data.createdAt).toLocaleString()}
        </Typography>
        <Typography variant='body2'>
          Последнее обновление: {new Date(data.updatedAt).toLocaleString()}
        </Typography>
        <Typography variant='body2'>
          Последний вход: {new Date(data.lastLoginAt || '').toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileView;
