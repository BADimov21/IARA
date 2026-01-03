import React, { useState, useEffect } from 'react';
import { ticketPurchaseApi, ticketTypeApi, personApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Select, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { TicketPurchaseFilter, BaseFilter } from '../../../shared/types';
import cardsImage from '../../../assets/cards.png';

interface TicketPurchaseItem {
  id: number;
  ticketNumber?: string;
  personId?: number;
  ticketTypeId?: number;
  purchaseDate?: string;
  validFrom?: string;
  validUntil?: string;
  pricePaid?: number;
  person?: { id: number; fullName: string; egn: string };
  ticketType?: { id: number; name: string };
}

export const TicketPurchaseList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [purchases, setPurchases] = useState<TicketPurchaseItem[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Array<{ id: number; typeName: string; priceAdult: number; validityDays: number }>>([]);
  const [userPersonId, setUserPersonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TicketPurchaseItem | null>(null);
  const [formData, setFormData] = useState({
    personId: '',
    ticketTypeId: '',
    purchaseDate: '',
    validFrom: '',
    validTo: '',
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadPurchases(),
      loadTicketTypes(),
      loadUserPersonInfo(),
    ]);
  };

  const loadTicketTypes = async () => {
    try {
      const data = await ticketTypeApi.getAll({ page: 1, pageSize: 100, filters: {} });
      console.log('Loaded ticket types:', data);
      setTicketTypes(data || []);
    } catch (error) {
      console.error('Failed to load ticket types:', error);
    }
  };

  const loadUserPersonInfo = async () => {
    try {
      const response = await personApi.hasCompletedPersonalInfo();
      if (response.hasCompleted && response.personId) {
        setUserPersonId(response.personId);
      }
    } catch (error) {
      console.error('Failed to load user person info:', error);
    }
  };

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<TicketPurchaseFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await ticketPurchaseApi.getAll(filters);
      setPurchases(data);
    } catch (error) {
      console.error('Failed to load ticket purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canCreate(role, 'ticketPurchases')) return;
    if (!userPersonId) {
      toast.error('Please complete your personal information first');
      return;
    }
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ 
      personId: userPersonId.toString(), 
      ticketTypeId: '', 
      purchaseDate: today, 
      validFrom: today, 
      validTo: '' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TicketPurchaseItem) => {
    if (!canEdit(role, 'ticketPurchases')) return;
    setEditingItem(item);
    setFormData({
      personId: item.personId?.toString() || '',
      ticketTypeId: item.ticketTypeId?.toString() || '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      validFrom: item.validFrom ? item.validFrom.split('T')[0] : '',
      validTo: item.validUntil ? item.validUntil.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleTicketTypeChange = (ticketTypeId: string) => {
    const selectedType = ticketTypes.find(t => t.id.toString() === ticketTypeId);
    const validFrom = formData.validFrom || new Date().toISOString().split('T')[0];
    
    if (selectedType) {
      const fromDate = new Date(validFrom);
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + selectedType.validityDays);
      setFormData(prev => ({
        ...prev,
        ticketTypeId,
        validFrom: validFrom,
        validTo: toDate.toISOString().split('T')[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, ticketTypeId }));
    }
  };

  const handleValidFromChange = (validFrom: string) => {
    setFormData(prev => ({ ...prev, validFrom }));
    
    if (formData.ticketTypeId && validFrom) {
      const selectedType = ticketTypes.find(t => t.id.toString() === formData.ticketTypeId);
      if (selectedType) {
        const fromDate = new Date(validFrom);
        const toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + selectedType.validityDays);
        setFormData(prev => ({
          ...prev,
          validFrom,
          validTo: toDate.toISOString().split('T')[0]
        }));
      }
    }
  };

  const getTicketPriceInEuros = (bgn: number): string => {
    // 1 EUR = 1.95583 BGN (Bulgarian Lev fixed rate)
    const eur = bgn / 1.95583;
    return eur.toFixed(2);
  };

  const getSelectedTicketPrice = (): { bgn: number; eur: string } | null => {
    if (!formData.ticketTypeId) return null;
    const selectedType = ticketTypes.find(t => t.id.toString() === formData.ticketTypeId);
    if (!selectedType) return null;
    return {
      bgn: selectedType.priceAdult,
      eur: getTicketPriceInEuros(selectedType.priceAdult)
    };
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'ticketPurchases')) return;
    
    const confirmed = await confirm({
      title: 'Delete Ticket Purchase',
      message: 'Are you sure you want to delete this ticket purchase? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await ticketPurchaseApi.delete(Number(id));
      toast.success('Ticket purchase deleted successfully');
      await loadPurchases();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete ticket purchase');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check permissions
    if (!canCreate(role, 'ticketPurchases')) {
      toast.error('You do not have permission to purchase tickets');
      return;
    }
    
    // Validate all required fields
    if (!formData.ticketTypeId) {
      toast.error('Please select a ticket type');
      return;
    }
    
    if (!formData.purchaseDate) {
      toast.error('Please select a purchase date');
      return;
    }
    
    if (!formData.validFrom) {
      toast.error('Please select a valid from date');
      return;
    }
    
    if (!formData.validTo) {
      toast.error('Please select a valid to date');
      return;
    }
    
    // Show payment modal
    setIsModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate card details (basic validation)
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
      toast.error('Please fill in all payment details');
      return;
    }

    try {
      // Simulate payment processing
      toast.info('Processing payment...');
      
      // Wait a bit to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const selectedTicket = ticketTypes.find(t => t.id.toString() === formData.ticketTypeId);
      const payload = {
        ticketTypeId: Number(formData.ticketTypeId),
        personId: Number(formData.personId),
        purchaseDate: formData.purchaseDate,
        validFrom: formData.validFrom,
        validUntil: formData.validTo,
        pricePaid: selectedTicket?.priceAdult || 0,
      };
      
      console.log('Sending ticket purchase payload:', payload);
      await ticketPurchaseApi.add(payload);
      
      setIsPaymentModalOpen(false);
      setPaymentData({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
      toast.success('Payment successful! Ticket purchased.');
      await loadPurchases();
    } catch (error) {
      console.error('Failed to process payment:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const columns: Column<TicketPurchaseItem>[] = [
    { key: 'ticketNumber', header: 'Ticket #' },
    { key: 'purchaseDate', header: 'Purchase Date', render: (item) => item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '-' },
    { key: 'person', header: 'Person', render: (item) => item.person?.fullName || '-' },
    { key: 'ticketType', header: 'Ticket Type', render: (item) => item.ticketType?.name || '-' },
    { key: 'validFrom', header: 'Valid From', render: (item) => item.validFrom ? new Date(item.validFrom).toLocaleDateString() : '-' },
    { key: 'validUntil', header: 'Valid Until', render: (item) => item.validUntil ? new Date(item.validUntil).toLocaleDateString() : '-' },
    { key: 'pricePaid', header: 'Price', render: (item) => item.pricePaid ? `${item.pricePaid} BGN` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'ticketPurchases') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'ticketPurchases') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'ticketPurchases') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', borderLeft: '4px solid rgb(99, 102, 241)' }}>
        <strong>🎟️ Recreational Fishing Tickets</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
          Purchase tickets here to legally fish in recreational areas. Each ticket type has different validity periods and prices. 
          Your ticket must be valid on the day you go fishing.
        </p>
      </div>
      <Card
        title="My Fishing Tickets"
        subtitle="View and purchase recreational fishing tickets"
        actions={canCreate(role, 'ticketPurchases') ? <Button variant="primary" onClick={handleAdd}>🎫 Purchase New Ticket</Button> : undefined}
      >
        <Table columns={columns} data={purchases} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Purchase' : 'Purchase Fishing Ticket'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#0369a1' }}>
              <strong>ℹ️ About Fishing Tickets:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Fishing tickets are required for recreational fishing. Select the ticket type that matches your fishing needs. The validity period will be automatically calculated based on the ticket type.</p>
            </div>
            
            {ticketTypes.length === 0 ? (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', color: '#991b1b' }}>
                <strong>⚠️ No ticket types available.</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>Please contact an administrator to set up ticket types.</p>
              </div>
            ) : (
              <Select 
                label="Ticket Type" 
                value={formData.ticketTypeId} 
                onChange={(e) => handleTicketTypeChange(e.target.value)} 
                options={ticketTypes.map(t => ({ 
                  value: t.id.toString(), 
                  label: `${t.typeName} - €${getTicketPriceInEuros(t.priceAdult)} EUR (${t.priceAdult} BGN) - Valid for ${t.validityDays} days` 
                }))}
                helperText="Choose the type of fishing ticket you want to purchase"
                required 
                fullWidth 
              />
            )}
            
            <Input 
              label="Purchase Date" 
              type="date" 
              value={formData.purchaseDate} 
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} 
              helperText="Date when you are purchasing this ticket"
              required 
              fullWidth 
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="Valid From" 
                type="date" 
                value={formData.validFrom} 
                onChange={(e) => handleValidFromChange(e.target.value)} 
                helperText="First day the ticket is valid"
                required 
                fullWidth 
              />
              <Input 
                label="Valid Until" 
                type="date" 
                value={formData.validTo} 
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })} 
                helperText="Automatically calculated based on ticket type"
                required 
                fullWidth
                disabled
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>
            
            {formData.ticketTypeId && (
              <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#4338ca' }}>
                <strong>ℹ️ About Validity Period:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>
                  The validity period is automatically set based on your selected ticket type. 
                  A {ticketTypes.find(t => t.id.toString() === formData.ticketTypeId)?.typeName} is valid for exactly {ticketTypes.find(t => t.id.toString() === formData.ticketTypeId)?.validityDays} day{ticketTypes.find(t => t.id.toString() === formData.ticketTypeId)?.validityDays !== 1 ? 's' : ''}.
                  If you need a longer period, please select a different ticket type.
                </p>
              </div>
            )}
            
            {formData.ticketTypeId && (
              <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#166534' }}>
                <strong>✓ Ticket Summary:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>
                  {ticketTypes.find(t => t.id.toString() === formData.ticketTypeId)?.typeName} ticket will be valid from {formData.validFrom ? new Date(formData.validFrom).toLocaleDateString() : '(select date)'} to {formData.validTo ? new Date(formData.validTo).toLocaleDateString() : '(select date)'}.
                </p>
                {getSelectedTicketPrice() && (
                  <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Total Price: €{getSelectedTicketPrice()!.eur} EUR ({getSelectedTicketPrice()!.bgn} BGN)
                  </p>
                )}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Proceed to Payment</Button>
            </div>
          </form>
        </Modal>
      )}

      {isPaymentModalOpen && (
        <Modal isOpen={isPaymentModalOpen} onClose={() => { setIsPaymentModalOpen(false); setIsModalOpen(true); }} title="💳 Payment Details" size="medium">
          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#4338ca' }}>
              <strong>🔒 Secure Payment</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Your payment information is encrypted and secure. This is a simulated payment for demonstration purposes.</p>
            </div>

            {getSelectedTicketPrice() && (
              <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)', borderRadius: '0.75rem', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>Amount to Pay</h3>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>€{getSelectedTicketPrice()!.eur} EUR</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>({getSelectedTicketPrice()!.bgn} BGN)</p>
              </div>
            )}
            
            <div>
              <Input 
                label="Card Number" 
                value={paymentData.cardNumber} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                  const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                  setPaymentData({ ...paymentData, cardNumber: formatted });
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                helperText="Enter your 16-digit card number"
                required 
                fullWidth 
              />
              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <img src={cardsImage} alt="Accepted cards" style={{ height: '24px', opacity: 0.7 }} />
              </div>
            </div>
            
            <Input 
              label="Cardholder Name" 
              value={paymentData.cardName} 
              onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
              placeholder="JOHN DOE"
              helperText="Name as it appears on your card"
              required 
              fullWidth 
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="Expiry Date" 
                value={paymentData.expiryDate} 
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setPaymentData({ ...paymentData, expiryDate: value });
                }}
                placeholder="MM/YY"
                maxLength={5}
                helperText="MM/YY"
                required 
                fullWidth 
              />
              <Input 
                label="CVV" 
                type="password"
                value={paymentData.cvv} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                  setPaymentData({ ...paymentData, cvv: value });
                }}
                placeholder="123"
                maxLength={3}
                helperText="3-digit security code"
                required 
                fullWidth 
              />
            </div>

            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#166534' }}>
              <strong>✓ What happens next:</strong>
              <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem' }}>
                <li>Your payment will be processed securely</li>
                <li>You'll receive a confirmation immediately</li>
                <li>Your fishing ticket will be activated instantly</li>
                <li>You can start fishing on the valid-from date</li>
              </ol>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => { setIsPaymentModalOpen(false); setIsModalOpen(true); }}>Back</Button>
              <Button type="submit" variant="primary">💳 Pay €{getSelectedTicketPrice()?.eur} EUR</Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title || 'Confirm'}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};
