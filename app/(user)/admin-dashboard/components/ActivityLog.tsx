import { FC } from 'react';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

interface ActivityLogProps {
  activities: Activity[];
}

export const ActivityLog: FC<ActivityLogProps> = ({ activities }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {index < activities.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                )}
                <div className="relative flex space-x-3">
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={activity.timestamp}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 