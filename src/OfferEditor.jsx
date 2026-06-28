import React from 'react';

export function OfferEditor({ offer, onSave, onCancel }) {
  const [editedOffer, setEditedOffer] = React.useState(offer);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedOffer);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <h2>Edit Offer</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Designation</label>
            <input type="text" name="designation" value={editedOffer.designation} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Annual CTC</label>
            <input type="number" name="annualCtc" value={editedOffer.annualCtc} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Joining Date</label>
            <input type="date" name="joiningDate" value={editedOffer.joiningDate} onChange={handleChange} />
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="button-secondary">Cancel</button>
          <button onClick={handleSave} className="button">Save</button>
        </div>
      </div>
    </div>
  );
}
