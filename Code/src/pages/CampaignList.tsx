import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { campaigns } from "../lib/api";

interface Campaign {
  id: number;
  name: string;
  objective: string;
  budget: number;
  status: string;
  impressions: number;
  clicks: number;
}

const CampaignList: React.FC = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const [campaignsData, setCampaignsData] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await campaigns.getByRestaurantId(restaurantId!);
        setCampaignsData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch campaigns.");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchCampaigns();
    }
  }, [restaurantId]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ad Campaigns</h1>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && campaignsData.length === 0 && <p>No campaigns found.</p>}

      {campaignsData.length > 0 && (
        <table className="w-full border shadow rounded-xl bg-white">
          <thead className="bg-gray-100 text-left text-sm text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Objective</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Status</th>
              <th className="p-3">Impressions</th>
              <th className="p-3">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {campaignsData.map((campaign) => (
              <tr key={campaign.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{campaign.name}</td>
                <td className="p-3">{campaign.objective}</td>
                <td className="p-3">
                  ${parseFloat(campaign.budget).toFixed(2)}
                </td>
                <td className="p-3 capitalize">{campaign.status}</td>
                <td className="p-3">{campaign.impressions}</td>
                <td className="p-3">{campaign.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CampaignList;
