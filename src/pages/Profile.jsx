import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({});
  const [addressServiceability, setAddressServiceability] = useState({ status: "idle" });
  const [addingAddress, setAddingAddress] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editAddress, setEditAddress] = useState({});
  const [editServiceability, setEditServiceability] = useState({ status: "idle" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      const res = await api.put("/users/me", { name });
      updateUser(res.data);
    } finally {
      setSavingName(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError("");
    if (!newAddress.houseNumber || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      setError("Please fill in the full address");
      return;
    }
    if (addressServiceability.status === "done" && !addressServiceability.serviceable) {
      setError("Sorry, we don't deliver to this pincode yet");
      return;
    }
    setAddingAddress(true);
    try {
      const res = await api.post("/users/me/addresses", newAddress);
      updateUser({ ...user, addresses: res.data });
      setNewAddress({});
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add address");
    } finally {
      setAddingAddress(false);
    }
  };

  const startEdit = (addr) => {
    setShowAddForm(false);
    setEditError("");
    setEditServiceability({ status: "idle" });
    setEditingId(addr._id);
    setEditAddress({
      houseNumber: addr.houseNumber,
      street: addr.street,
      landmark: addr.landmark,
      city: addr.city,
      pincode: addr.pincode,
      location: addr.location,
    });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setEditError("");
    if (!editAddress.houseNumber || !editAddress.street || !editAddress.city || !editAddress.pincode) {
      setEditError("Please fill in the full address");
      return;
    }
    if (editServiceability.status === "done" && !editServiceability.serviceable) {
      setEditError("Sorry, we don't deliver to this pincode yet");
      return;
    }
    setSavingEdit(true);
    try {
      const res = await api.put(`/users/me/addresses/${editingId}`, editAddress);
      updateUser({ ...user, addresses: res.data });
      setEditingId(null);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update address");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const res = await api.delete(`/users/me/addresses/${addressId}`);
    updateUser({ ...user, addresses: res.data });
  };

  const handleSetDefault = async (addressId) => {
    const res = await api.put(`/users/me/addresses/${addressId}`, { isDefault: true });
    updateUser({ ...user, addresses: res.data });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <h1 className="font-display text-xl font-semibold text-brand-900">Profile</h1>

      <div className="card p-4">
        <label className="mb-1 block text-sm font-medium text-brand-900/80">Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input flex-1"
          />
          <button onClick={handleSaveName} disabled={savingName} className="btn btn-primary">
            Save
          </button>
        </div>
        <p className="mt-3 text-sm text-brand-900/50">Phone: {user.phone}</p>
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-brand-900/80">Addresses</h2>
          <button
            onClick={() => {
              setEditingId(null);
              setShowAddForm((s) => !s);
            }}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            {showAddForm ? "Cancel" : "+ Add New"}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {user.addresses?.map((addr) =>
            editingId === addr._id ? (
              <form
                key={addr._id}
                onSubmit={handleUpdateAddress}
                className="flex flex-col gap-3 rounded-lg border border-brand-300 bg-brand-50/40 p-3"
              >
                <AddressForm
                  value={editAddress}
                  onChange={setEditAddress}
                  onServiceabilityChange={setEditServiceability}
                  showLocationCapture
                />
                {editError && <p className="text-sm text-red-600">{editError}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={
                      savingEdit ||
                      (editServiceability.status === "done" && !editServiceability.serviceable)
                    }
                    className="btn btn-primary"
                  >
                    {savingEdit ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={addr._id}
                className="flex items-start justify-between gap-2 rounded-lg border border-brand-900/10 p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-brand-900">
                    {addr.label || "Address"} {addr.isDefault && (
                      <span className="ml-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-brand-900/50">
                    {addr.houseNumber}, {addr.street}
                    {addr.landmark ? `, ${addr.landmark}` : ""}
                    <br />
                    {addr.city} - {addr.pincode}
                  </p>
                  {addr.location && (
                    <p className="mt-1 text-xs text-brand-600">📍 Exact location pinned</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-1 text-xs">
                  <button
                    onClick={() => startEdit(addr)}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="font-medium text-brand-600 hover:underline"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="font-medium text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
          {(!user.addresses || user.addresses.length === 0) && (
            <p className="text-sm text-brand-900/50">No saved addresses yet.</p>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAddress} className="mt-4 flex flex-col gap-3 border-t border-brand-900/10 pt-4">
            <AddressForm
              value={newAddress}
              onChange={setNewAddress}
              onServiceabilityChange={setAddressServiceability}
              showLocationCapture
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={
                addingAddress ||
                (addressServiceability.status === "done" && !addressServiceability.serviceable)
              }
              className="btn btn-primary"
            >
              {addingAddress ? "Saving..." : "Save Address"}
            </button>
          </form>
        )}
      </div>

      <button onClick={handleLogout} className="btn btn-secondary">
        Logout
      </button>
    </div>
  );
}
