/**
 * Example Usage of IARA API Client in React Components
 * 
 * This file demonstrates common patterns for using the API client
 * in React components with proper error handling and type safety.
 */

import { useEffect, useState } from 'react';
import {
  authApi,
  fishSpecyApi,
  vesselApi,
  fishingTripApi,
} from './index';
import type {
  BaseFilter,
  FishSpecyFilter,
  ErrorResponse,
} from '../types';

// ==================== Authentication Example ====================

export function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await authApi.login({
        userName: username,
        password,
      });

      console.log('Login successful, token received');
      // Navigate to dashboard or home page
      
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your login form UI */}
      {error && <div className="error">{error}</div>}
      <button onClick={() => handleLogin('user@example.com', 'password')} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}

// ==================== List with Pagination Example ====================

export function FishSpeciesListComponent() {
  const [fishSpecies, setFishSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFishSpecies = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: BaseFilter<FishSpecyFilter> = {
        page: page,
        pageSize: 20,
        filters: {
          speciesName: searchTerm || undefined,
        },
      };

      const data = await fishSpecyApi.getAll(filters);
      setFishSpecies(data);
      
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFishSpecies();
  }, [page, searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search fish species..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <ul>
        {fishSpecies.map((fish) => (
          <li key={fish.id}>
            {fish.name} - {fish.speciesName}
          </li>
        ))}
      </ul>

      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

// ==================== Create/Add Example ====================

export function AddFishSpecyComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: {
    speciesName: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newId = await fishSpecyApi.add({
        speciesName: formData.speciesName,
      });

      console.log('Fish species created with ID:', newId);
      setSuccess(true);
      
      // Optionally navigate or reset form
      
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Fish species added successfully!</div>}
      {/* Your form UI */}
    </div>
  );
}

// ==================== Edit/Update Example ====================

export function EditFishSpecyComponent({ fishId }: { fishId: number }) {
  const [fishSpecy, setFishSpecy] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing data
  useEffect(() => {
    const loadFishSpecy = async () => {
      try {
        const data = await fishSpecyApi.get(fishId);
        setFishSpecy(data);
      } catch (err) {
        const apiError = err as ErrorResponse;
        setError(apiError.message);
      }
    };

    loadFishSpecy();
  }, [fishId]);

  const handleUpdate = async (updatedData: {
    speciesName: string;
  }) => {
    if (!fishSpecy) return;

    setLoading(true);
    setError(null);

    try {
      await fishSpecyApi.edit({
        id: fishSpecy.id,
        speciesName: updatedData.speciesName,
      });

      console.log('Fish species updated');
      // Navigate back or show success message
      
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fishSpecy) return <div>Loading...</div>;

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* Your edit form UI with fishSpecy data */}
    </div>
  );
}

// ==================== Delete Example ====================

export function DeleteFishSpecyButton({ fishId }: { fishId: number }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this fish species?')) {
      return;
    }

    setLoading(true);

    try {
      const success = await fishSpecyApi.delete(fishId);
      if (success) {
        console.log('Fish species deleted');
        // Refresh list or navigate
      }
    } catch (err) {
      const apiError = err as ErrorResponse;
      alert(`Error: ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}

// ==================== Complex Relationship Example ====================

export function FishingTripsComponent() {
  const [trips, setTrips] = useState<any[]>([]);
  const [vessels, setVessels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load vessels and trips in parallel
        const [vesselsData, tripsData] = await Promise.all([
          vesselApi.getAll({
            page: 1,
            pageSize: 100,
            filters: {},
          }),
          fishingTripApi.getAll({
            page: 1,
            pageSize: 20,
            filters: {},
          }),
        ]);

        setVessels(vesselsData);
        setTrips(tripsData);
        
      } catch (err) {
        const apiError = err as ErrorResponse;
        console.error('Failed to load data:', apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Active Fishing Trips</h2>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            Permit ID: {trip.fishingPermitId} - 
            Departed: {new Date(trip.departureDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==================== Custom Hook Example ====================

export function useFishSpecies(filters?: FishSpecyFilter) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fishSpecyApi.getAll({
        page: 1,
        pageSize: 100,
        filters: filters || {},
      });
      setData(result);
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, reload };
}

// Usage of custom hook:
export function FishSpeciesDropdown() {
  const { data: fishSpecies, loading } = useFishSpecies({});

  if (loading) return <select disabled><option>Loading...</option></select>;

  return (
    <select>
      <option value="">Select a fish species</option>
      {fishSpecies.map((fish) => (
        <option key={fish.id} value={fish.id}>
          {fish.name}
        </option>
      ))}
    </select>
  );
}

// ==================== Protected Route Example ====================

export function ProtectedComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = authApi.isAuthenticated();
    
    if (!authenticated) {
      // Redirect to login
      window.location.href = '/login';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div>
      {/* Protected content */}
      <button onClick={() => authApi.logout()}>Logout</button>
    </div>
  );
}
