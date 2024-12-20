import { FC } from 'react';
import { User } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  is_admin: boolean;
  is_contributor: boolean;
  is_subscriber: boolean;
}

interface UsersListProps {
  users: UserData[];
  onUpdateUser: (userId: string, updates: Partial<UserData>) => Promise<void>;
}

export const UsersList: FC<UsersListProps> = ({ users, onUpdateUser }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">Users Management</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {user.profile.firstName} {user.profile.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Role badges */}
                {user.is_admin && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Admin
                  </span>
                )}
                {user.is_contributor && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Contributor
                  </span>
                )}
                {user.is_subscriber && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Subscriber
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 