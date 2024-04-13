import { useFormState } from '@/hooks/useFormState';
import { BottomSheet, BottomSheetTitle, useBottomSheetModal } from './modal';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Pressable } from 'react-native';
import { ChevronDown, Settings } from '@tamagui/lucide-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  Adapt,
  Button,
  DialogSheetContents,
  Input,
  Select,
  Sheet,
  Text,
  useTheme,
} from 'tamagui';
import type { Tables } from '@/types/supabase';
import { View } from 'tamagui';
import useSWR from 'swr';
import { fetchUsers } from '@/lib/fetchers';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { useSession } from '@/lib/ctx';
import { useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface SettingsSheetProps {
  user: Tables<'users'>;
}

export const SettingsSheet = ({ user }: SettingsSheetProps) => {
  const settingSheet = useBottomSheetModal({
    snapPoints: ['50%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: () => console.log('onPresent'),
  });

  const { formState, setFormState } = useFormState();

  const signOut = async () => {
    setFormState('loading');

    const { error } = await supabase.auth.signOut();

    setFormState(error ? 'error' : 'idle');

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error signing out',
        text2: error.message,
      });
      return;
    }

    settingSheet.dismiss();
  };

  return (
    <>
      <Pressable>
        {({ pressed }) => (
          <Settings
            opacity={pressed ? 0.5 : 1}
            size={24}
            style={{
              marginRight: 16,
            }}
            onPress={settingSheet.present}
          />
        )}
      </Pressable>
      <BottomSheet {...settingSheet}>
        <View width="100%" height="100%">
          <BottomSheetTitle centerTitle>Settings</BottomSheetTitle>
          <BottomSheetScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 40,
              gap: 12,
              width: '100%',
            }}
            style={{ height: '100%' }}
          >
            <View width="100%" gap={4} mb="$4">
              <Text textAlign="center" fontSize="$6">
                {user.email}
              </Text>
              <Text textAlign="center" fontSize="$6">
                ({user.role})
              </Text>
            </View>
            {user.role === 'admin' && <ManageUsers />}
            <Button w="80%" bg="$red8" fontSize="$5" onPress={signOut}>
              {
                {
                  idle: 'Sign Out',
                  loading: 'Signing Out...',
                  error: 'Sign Out',
                }[formState]
              }
            </Button>
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    </>
  );
};

const createUserSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(3, 'Name must be at least 3 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  role: z.enum(['worker', 'receptionist']),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters'),
});

const editUserSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(3, 'Name must be at least 3 characters'),
  role: z.enum(['worker', 'receptionist']),
});

export const ManageUsers = () => {
  const manageUsersSheet = useBottomSheetModal({
    snapPoints: ['92.5%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: () => console.log('onPresent'),
  });

  const {
    data: users,
    error,
    isLoading: loading,
    mutate,
  } = useSWR('users', fetchUsers);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'worker',
      password: '',
    },
  });

  const {
    control: editControl,
    reset: editReset,
    handleSubmit: editHandleSubmit,
    formState: { errors: editErrors },
  } = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      id: '',
      name: '',
      role: 'worker',
    },
  });

  const createUserSheet = useBottomSheetModal({
    snapPoints: ['60%', '75%', '92.5%'],
    onDismiss: () =>
      reset({
        name: '',
        email: '',
        role: 'worker',
        password: '',
      }),
    onPresent: () => console.log('onPresent'),
  });

  const validationError = Object.values(errors)[0];

  const theme = useTheme();

  const [currentId, setCurrentId] = useState<string | null>(null);
  const { formState, setFormState } = useFormState();
  const { formState: userFormState, setFormState: setUserFormState } =
    useFormState();
  const { formState: editFormState, setFormState: setEditFormState } =
    useFormState();

  const createUser = handleSubmit(async ({ name, email, role, password }) => {
    setUserFormState('loading');

    const { error, data: id } = await supabase.rpc('create_user', {
      email,
      password,
    });

    if (error) {
      setUserFormState('error');
      Toast.show({
        type: 'error',
        text1: 'Error creating user',
        text2: error.message,
      });
      return;
    }

    const { error: insertError } = await supabase.from('users').insert({
      id,
      name,
      email,
      role,
    });

    if (insertError) {
      setUserFormState('error');
      Toast.show({
        type: 'error',
        text1: 'Error creating user',
        text2: insertError.message,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'User created',
    });

    mutate();
    setUserFormState('idle');

    createUserSheet.dismiss();
  });

  const deleteUser = async (id: string) => {
    setCurrentId(id);
    setFormState('loading');

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error deleting user',
        text2: error.message,
      });
      return;
    }

    setCurrentId(null);
    setFormState('idle');

    Toast.show({
      type: 'success',
      text1: 'User deleted',
    });

    mutate();
  };

  const editUser = editHandleSubmit(async ({ id, name, role }) => {
    setEditFormState('loading');

    const { error } = await supabase
      .from('users')
      .update({ name, role })
      .eq('id', id);

    if (error) {
      setEditFormState('error');
      Toast.show({
        type: 'error',
        text1: 'Error editing user',
        text2: error.message,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'User edited',
    });

    mutate();
    setEditFormState('idle');

    editUserSheet.dismiss();
  });

  if (error) {
    return (
      <View
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="$5">Error loading users</Text>
        <Button
          onPress={() => {
            mutate();
          }}
        >
          Retry
        </Button>
      </View>
    );
  }

  if (loading || !users) {
    return (
      <View justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={theme.color.get()} />
      </View>
    );
  }

  const editUserSheet = useBottomSheetModal({
    snapPoints: ['60%', '75%', '92.5%'],
    onDismiss: () =>
      editReset({
        name: '',
        role: 'worker',
      }),
    onPresent: id => {
      const user = users.find(user => user.id === id);
      if (!user) return;
      editReset({
        id: user.id,
        name: user.name,
        role: user.role,
      });
    },
  });

  return (
    <>
      <Button
        w="80%"
        bg="$purple9"
        fontSize="$5"
        onPress={manageUsersSheet.present}
      >
        Manage Users
      </Button>
      <BottomSheet {...manageUsersSheet}>
        <View width="100%" height="100%" pos="relative">
          <BottomSheetTitle centerTitle>Manage Users</BottomSheetTitle>
          <FlatList
            data={users}
            style={{ padding: 20 }}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={mutate} />
            }
            ListEmptyComponent={
              <View
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$5">No users found</Text>
              </View>
            }
            ItemSeparatorComponent={() => <View height="$1" />}
            renderItem={({ item }) => (
              <View
                key={item.id}
                width="100%"
                bg="$gray2"
                p="$4"
                gap="$4"
                borderRadius="$4"
              >
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                  gap="$4"
                >
                  <View>
                    <Text
                      numberOfLines={1}
                      textOverflow="ellipsis"
                      flex={1}
                      gap="$4"
                      fontSize="$5"
                    >
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      textOverflow="ellipsis"
                      flex={1}
                      gap="$4"
                      fontSize="$5"
                    >
                      {item.email}
                    </Text>
                  </View>
                  <Text fontSize="$5">{item.role}</Text>
                </View>
                <View
                  flexDirection="row"
                  justifyContent="space-between"
                  gap="$4"
                >
                  <Button
                    flex={1}
                    bg="$green9"
                    fontSize="$5"
                    onPress={() => editUserSheet.present(item.id)}
                  >
                    Edit User
                  </Button>
                  <BottomSheet {...editUserSheet}>
                    <View width="100%" height="100%">
                      <BottomSheetTitle centerTitle>Edit User</BottomSheetTitle>
                      <BottomSheetScrollView
                        contentContainerStyle={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 40,
                          gap: 12,
                          width: '100%',
                        }}
                        style={{ height: '100%' }}
                      >
                        <Controller
                          control={editControl}
                          name="name"
                          render={({
                            field: { onChange, value, onBlur, disabled },
                          }) => (
                            <Input
                              w="100%"
                              placeholder="Name"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              disabled={disabled}
                            />
                          )}
                        />

                        <Controller
                          control={editControl}
                          name="role"
                          render={({ field: { onChange, value } }) => (
                            <Select value={value} onValueChange={onChange}>
                              <Select.Trigger iconAfter={ChevronDown}>
                                <Select.Value placeholder="Role" />
                              </Select.Trigger>

                              <Adapt when="sm" platform="touch">
                                <Sheet
                                  modal
                                  dismissOnSnapToBottom
                                  animationConfig={{
                                    type: 'spring',
                                    damping: 20,
                                    mass: 1.2,
                                    stiffness: 250,
                                  }}
                                  snapPoints={[40, 60, 75, 92.5]}
                                >
                                  <Sheet.Frame gap="$4" p="$4">
                                    <Text textAlign="center" fontSize="$6">
                                      Select a role
                                    </Text>
                                    {['worker', 'receptionist'].map(
                                      (role, index) => (
                                        <Select.Item
                                          index={index}
                                          key={role}
                                          value={role}
                                          p="$4"
                                          bg="$gray2"
                                          borderRadius="$4"
                                        >
                                          <Select.ItemText
                                            unstyled
                                            color="$color"
                                          >
                                            {role.charAt(0).toUpperCase() +
                                              role.slice(1)}
                                          </Select.ItemText>
                                          <Select.ItemIndicator />
                                        </Select.Item>
                                      )
                                    )}
                                  </Sheet.Frame>
                                  <Sheet.Overlay />
                                </Sheet>
                              </Adapt>
                            </Select>
                          )}
                        />

                        {editErrors.name && (
                          <Text color="$red8">{editErrors.name.message}</Text>
                        )}

                        <Button
                          bg="$purple9"
                          w="100%"
                          fontSize="$5"
                          onPress={editUser}
                          disabled={editFormState === 'loading'}
                          opacity={editFormState === 'loading' ? 0.5 : 1}
                        >
                          {
                            {
                              idle: 'Edit User',
                              loading: 'Editing...',
                              error: 'Edit User',
                            }[editFormState]
                          }
                        </Button>
                      </BottomSheetScrollView>
                    </View>
                  </BottomSheet>
                  <Button
                    flex={1}
                    bg="$red9"
                    fontSize="$5"
                    onPress={() => deleteUser(item.id)}
                    disabled={currentId === item.id && formState === 'loading'}
                    opacity={
                      currentId === item.id && formState === 'loading' ? 0.5 : 1
                    }
                  >
                    {currentId === item.id
                      ? {
                          idle: 'Delete User',
                          loading: 'Deleting...',
                          error: 'Delete User',
                        }[formState]
                      : 'Delete User'}
                  </Button>
                </View>
              </View>
            )}
          />
          <View w="100%" p="$8" ai="center" jc="center">
            <Button
              bg="$purple9"
              w="80%"
              fontSize="$5"
              onPress={createUserSheet.present}
            >
              {
                {
                  idle: 'Create User',
                  loading: 'Creating...',
                  error: 'Create User',
                }[userFormState]
              }
            </Button>
          </View>
          <BottomSheet {...createUserSheet}>
            <View width="100%" height="100%">
              <BottomSheetTitle centerTitle>Create User</BottomSheetTitle>
              <BottomSheetScrollView
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 40,
                  gap: 12,
                  width: '100%',
                }}
                style={{ height: '100%' }}
              >
                <Controller
                  control={control}
                  name="name"
                  render={({
                    field: { onChange, value, onBlur, disabled },
                  }) => (
                    <Input
                      w="100%"
                      placeholder="Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      disabled={disabled}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { onChange, value, onBlur, disabled },
                  }) => (
                    <Input
                      w="100%"
                      placeholder="Email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      disabled={disabled}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="role"
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <Select.Trigger iconAfter={ChevronDown}>
                        <Select.Value placeholder="Role" />
                      </Select.Trigger>

                      <Adapt when="sm" platform="touch">
                        <Sheet
                          modal
                          dismissOnSnapToBottom
                          animationConfig={{
                            type: 'spring',
                            damping: 20,
                            mass: 1.2,
                            stiffness: 250,
                          }}
                          snapPoints={[40, 60, 75, 92.5]}
                        >
                          <Sheet.Frame gap="$4" p="$4">
                            <Text textAlign="center" fontSize="$6">
                              Select a role
                            </Text>
                            {['worker', 'receptionist'].map((role, index) => (
                              <Select.Item
                                index={index}
                                key={role}
                                value={role}
                                p="$4"
                                bg="$gray2"
                                borderRadius="$4"
                              >
                                <Select.ItemText unstyled color="$color">
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </Select.ItemText>
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Sheet.Frame>
                          <Sheet.Overlay />
                        </Sheet>
                      </Adapt>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { onChange, value, onBlur, disabled },
                  }) => (
                    <Input
                      w="100%"
                      placeholder="Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      disabled={disabled}
                      secureTextEntry
                    />
                  )}
                />

                {validationError && (
                  <Text color="$red8">{validationError.message}</Text>
                )}

                <Button
                  bg="$purple9"
                  w="100%"
                  fontSize="$5"
                  onPress={createUser}
                  disabled={userFormState === 'loading'}
                  opacity={userFormState === 'loading' ? 0.5 : 1}
                >
                  {
                    {
                      idle: 'Create User',
                      loading: 'Creating...',
                      error: 'Create User',
                    }[userFormState]
                  }
                </Button>
              </BottomSheetScrollView>
            </View>
          </BottomSheet>
        </View>
      </BottomSheet>
    </>
  );
};