"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CVBuilder from '@/components/cv/CVBuilder';
import { Card, Button, Container, Space, Text, Title } from '@mantine/core';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/user');
      const data = await response.json();

      if (response.status === 401) {
        router.push('/sign-in');
      } else {
        setUser(data as User);
      }
    };

    fetchData();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container size="lg" className="min-h-screen py-12">
      <Card withBorder shadow="sm" padding="lg" radius="md" className="mb-8">
        <div className="flex items-center space-x-4">
          <Image
            className="h-16 w-16 rounded-full"
            src={user.imageUrl}
            alt={`${user.firstName}'s avatar`}
            width={64}
            height={64}
          />
          <div>
            <Title order={2} className="text-2xl font-bold text-gray-900">
              Welcome back, {user.firstName}!
            </Title>
            <Text size="sm" color="dimmed">
              {user.emailAddresses[0].emailAddress}
            </Text>
            <Space h="md" />
            <Button onClick={() => router.push('/')} variant="outline" color="blue" size="sm">
              Go Back
            </Button>
          </div>
        </div>
      </Card>

      <Space h="xl" />

      <CVBuilder />
    </Container>
  );
}