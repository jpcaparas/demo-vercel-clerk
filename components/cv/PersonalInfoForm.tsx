'use client';

import { Card, TextInput, Textarea, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updatePersonalInfo } from '@/store/features/cv/cvSlice';
import type { PersonalInfo } from '@/types/cv';
import { useUser } from '@clerk/nextjs';
import { useEffect, useCallback, useRef } from 'react';

const URL_PATTERN = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export default function PersonalInfoForm() {
  const dispatch = useDispatch();
  const { user } = useUser();
  const personalInfo = useSelector((state: RootState) => state.cv.personalInfo);
  const initialLoadDone = useRef(false);

  const form = useForm<PersonalInfo>({
    initialValues: personalInfo,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      phone: (value) => !value || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value) ? null : 'Invalid phone number',
      website: (value) => !value || URL_PATTERN.test(value) ? null : 'Invalid URL format',
      linkedin: (value) => !value || (URL_PATTERN.test(value) && value.includes('linkedin.com')) ? null : 'Invalid LinkedIn URL',
      github: (value) => !value || (URL_PATTERN.test(value) && value.includes('github.com')) ? null : 'Invalid GitHub URL',
      firstName: (value) => value.length < 2 ? 'First name must be at least 2 characters' : null,
      lastName: (value) => value.length < 2 ? 'Last name must be at least 2 characters' : null,
    },
  });

  // Load initial data from user profile only once
  useEffect(() => {
    if (!user || initialLoadDone.current) return;
      
    const initialData = {
      ...personalInfo, // Keep existing CV data
      // Only use Clerk data if corresponding CV fields are empty
      firstName: personalInfo.firstName || user.firstName || '',
      lastName: personalInfo.lastName || user.lastName || '',
      email: personalInfo.email || user.primaryEmailAddress?.emailAddress || '',
    };
    
    form.setValues(initialData);
    dispatch(updatePersonalInfo(initialData));
    initialLoadDone.current = true;
  }, [user, dispatch, form, personalInfo]);

  const handleChange = useCallback(async (name: string, value: string) => {
    if (!form.validateField(name).hasError) {
      const updatedData = { ...form.values, [name]: value };
      form.setValues(updatedData);
      dispatch(updatePersonalInfo(updatedData));
    }
  }, [dispatch, form]);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="First Name"
              required
              {...form.getInputProps('firstName')}
              onChange={(e) => {
                form.setFieldValue('firstName', e.target.value);
                handleChange('firstName', e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Last Name"
              required
              {...form.getInputProps('lastName')}
              onChange={(e) => {
                form.setFieldValue('lastName', e.target.value);
                handleChange('lastName', e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Email"
              type="email"
              required
              {...form.getInputProps('email')}
              onChange={(e) => {
                form.setFieldValue('email', e.target.value);
                handleChange('email', e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Phone"
              {...form.getInputProps('phone')}
              onChange={(e) => {
                form.setFieldValue('phone', e.target.value);
                handleChange('phone', e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Location"
              placeholder="City, Country"
              {...form.getInputProps('location')}
              onChange={(e) => {
                form.setFieldValue('location', e.target.value);
                handleChange('location', e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="LinkedIn"
              placeholder="https://linkedin.com/in/..."
              {...form.getInputProps('linkedin')}
              onChange={(e) => {
                const value = e.target.value.startsWith('http') ? e.target.value : `https://${e.target.value}`;
                form.setFieldValue('linkedin', value);
                handleChange('linkedin', value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="GitHub"
              placeholder="https://github.com/..."
              {...form.getInputProps('github')}
              onChange={(e) => {
                const value = e.target.value.startsWith('http') ? e.target.value : `https://${e.target.value}`;
                form.setFieldValue('github', value);
                handleChange('github', value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Personal Website"
              placeholder="https://..."
              {...form.getInputProps('website')}
              onChange={(e) => {
                const value = e.target.value.startsWith('http') ? e.target.value : `https://${e.target.value}`;
                form.setFieldValue('website', value);
                handleChange('website', value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Professional Title"
              placeholder="e.g., Senior Software Engineer"
              {...form.getInputProps('title')}
              onChange={(e) => {
                form.setFieldValue('title', e.target.value);
                handleChange('title', e.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Professional Bio"
              placeholder="Write a brief professional summary..."
              minRows={3}
              maxRows={6}
              {...form.getInputProps('bio')}
              onChange={(e) => {
                form.setFieldValue('bio', e.target.value);
                handleChange('bio', e.target.value);
              }}
            />
          </Grid.Col>
        </Grid>
      </form>
    </Card>
  );
}