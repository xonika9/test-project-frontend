import { Box, MenuItem, TextField, Typography } from '@mui/material';
import { Control, Controller, FieldError } from 'react-hook-form';

interface ProfileFieldProps {
    name: string;
    label: string;
    control?: Control<any>;
    error?: FieldError;
    editMode: boolean;
    value: string | null;
    type?: 'text' | 'select' | 'multiline';
    selectItems?: { value: string; label: string }[];
    multilineRows?: number;
}

const ProfileField = ({
    name,
    label,
    control,
    error,
    editMode,
    value,
    type = 'text',
    selectItems = [],
    multilineRows = 3,
}: ProfileFieldProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: name === 'avatarUrl' && value && !editMode ? 'flex-start' : 'center',
                gap: 2,
            }}
        >
            <Typography variant='body1' sx={{ minWidth: 120 }}>
                {label}:
            </Typography>
            {editMode && control ? (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            size='small'
                            select={type === 'select'}
                            multiline={type === 'multiline'}
                            rows={multilineRows}
                            error={!!error}
                            helperText={errors?.avatarUrl?.message}
                        >
                            {selectItems.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            ) : name === 'avatarUrl' && value ? (
                <img
                    src={value}
                    alt='Аватар'
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
            ) : (
                <Typography>{value || 'Не указано'}</Typography>
            )}
        </Box>
    );
};

export default ProfileField;
