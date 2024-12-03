import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    company: '',
    role: '',
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      await update(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <Input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <Input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications.email"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label htmlFor="notifications.email">Email notifications</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications.sms"
              name="notifications.sms"
              checked={formData.notifications.sms}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label htmlFor="notifications.sms">SMS notifications</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications.push"
              name="notifications.push"
              checked={formData.notifications.push}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <label htmlFor="notifications.push">Push notifications</label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </Card>
  );
}
