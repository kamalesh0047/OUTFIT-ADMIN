import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "../context/ToastContext.jsx";

const EMPTY = {
  fullName: "", phone: "", house: "", area: "",
  city: "", state: "", pincode: "", landmark: "",
};

export default function Address() {
  const { addToast } = useToast();
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadAddress(); }, []);

  const loadAddress = async () => {
    if (!auth.currentUser) { setLoaded(true); return }
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists() && snap.data().address) setAddress(snap.data().address);
    } catch (err) { console.error(err); }
    finally { setLoaded(true); }
  };

  const hasAddress = !!address.fullName?.trim();

  const validate = () => {
    if (!address.fullName.trim()) return "Full name is required";
    if (address.fullName.trim().length < 3) return "Full name must be at least 3 characters";
    if (!/^\d{10}$/.test(address.phone.replace(/\D/g, ""))) return "Phone number must be 10 digits";
    if (!address.house.trim()) return "House / Flat is required";
    if (!address.area.trim()) return "Area is required";
    if (!address.city.trim()) return "City is required";
    if (!address.state.trim()) return "State is required";
    if (!/^\d{6}$/.test(address.pincode)) return "PIN code must be 6 digits";
    return null;
  };

  const saveAddress = async () => {
    const err = validate();
    if (err) { addToast(err); return }
    try {
      setSaving(true);
      await setDoc(doc(db, "users", auth.currentUser.uid), { address }, { merge: true });
      setEditingAddress(false);
      addToast("Address saved");
    } catch (e) {
      console.error(e); addToast("Failed to save address — try again");
    } finally { setSaving(false); }
  };

  if (!loaded) return <div><h2>Saved Address</h2><p style={{ color: "var(--muted)", marginTop: 8 }}>Loading…</p></div>;

  return (
    <div>
      <h2>Saved Address</h2>

      {editingAddress ? (
        <>
          <input className="input" placeholder="Full Name *" value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
          <input className="input" placeholder="Phone (10 digits) *" type="tel" maxLength={10} value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "") })} />
          <input className="input" placeholder="House / Flat *" value={address.house}
            onChange={(e) => setAddress({ ...address, house: e.target.value })} />
          <input className="input" placeholder="Area *" value={address.area}
            onChange={(e) => setAddress({ ...address, area: e.target.value })} />
          <input className="input" placeholder="City *" value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })} />
          <input className="input" placeholder="State *" value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })} />
          <input className="input" placeholder="Pincode (6 digits) *" maxLength={6} value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "") })} />
          <input className="input" placeholder="Landmark (optional)" value={address.landmark}
            onChange={(e) => setAddress({ ...address, landmark: e.target.value })} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={saveAddress} disabled={saving}>{saving ? "Saving…" : "Save Address"}</button>
            <button className="btn btn--ghost" onClick={() => setEditingAddress(false)} disabled={saving}>Cancel</button>
          </div>
        </>
      ) : hasAddress ? (
        <div className="account__order">
          <div>
            <strong>{address.fullName}</strong>
            <span>
              {[address.house, address.area, address.city, address.state].filter(Boolean).join(", ")}
              {address.pincode ? ` - ${address.pincode}` : ""}
              {address.landmark ? ` (${address.landmark})` : ""}
            </span>
            {address.phone && <span style={{ display: "block", marginTop: 4, color: "var(--muted)" }}>📞 {address.phone}</span>}
          </div>
          <button className="btn btn--ghost" onClick={() => setEditingAddress(true)}>Edit</button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "28px 0", color: "var(--muted)" }}>
          <MapPin size={34} style={{ opacity: 0.4, marginBottom: 10 }} />
          <p style={{ marginBottom: 14 }}>No address saved yet.</p>
          <button className="btn" onClick={() => setEditingAddress(true)}>Add address</button>
        </div>
      )}
    </div>
  );
}
