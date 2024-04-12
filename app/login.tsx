import { useEffect, useState } from 'react';
import { Controller, useForm, type FieldValues } from 'react-hook-form';
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { Button, Input, ScrollView, Text, View } from 'tamagui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { useFormState } from '@/hooks/useFormState';

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Enter a valid email.',
    }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(8, {
      message: 'Password must be at least 8 characters.',
    }),
});

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'jatin@shivshakti.in',
      password: '12345678',
    },
  });

  const { formState, setFormState } = useFormState();

  const error = Object.values(errors)[0];

  const onSubmit = handleSubmit(async ({ email, password }) => {

    setFormState('loading');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setFormState(error ? 'error' : 'idle');

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to login.',
        text2: error.message,
      });
      return;
    }

    router.replace('/(app)/');

    Toast.show({
      type: 'success',
      text1: 'Welcome back!',
    });
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '$3.5',
        padding: '$8',
        backgroundColor: '$backgroundStrong',
      }}
      bg="$backgroundStrong"
    >
      <Text fontSize="$9" mb="$8" fontWeight={'800'}>
        Shiv Shakti
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value, disabled } }) => (
          <Input
            w="100%"
            placeholder="Email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            disabled={disabled}
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value, disabled } }) => (
          <Input
            w="100%"
            placeholder="Password"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            disabled={disabled}
          />
        )}
        name="password"
      />
      {error && <Text color="$red9">{error.message}</Text>}
      <Button w="100%" bg="$purple10" onPress={onSubmit}>
        {
          {
            idle: 'Login',
            loading: 'Logging in...',
            error: 'Try again',
          }[formState]
        }
      </Button>
    </ScrollView>
  );
}
