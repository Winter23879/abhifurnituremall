import mongoose, { Schema, Document } from 'mongoose';

// -------------------------------------------------------------
// 1. PRODUCT MODEL
// -------------------------------------------------------------
const MaterialOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    hex: { type: String, required: true },
    extraPrice: { type: Number, default: 0 },
    category: { type: String, default: 'wood' },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    japaneseName: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    dimensions: {
      width: { type: Number, required: true },
      depth: { type: Number, required: true },
      height: { type: Number, required: true },
      unit: { type: String, default: 'cm' },
    },
    woodOptions: [MaterialOptionSchema],
    fabricOptions: [MaterialOptionSchema],
    primaryImage: { type: String, required: true },
    secondaryImage: { type: String, default: '' },
    gallery: [{ type: String }],
    materialsSummary: { type: String, default: '' },
    leadTime: { type: String, default: 'Made to order (3-4 weeks)' },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 12 },
    designer: { type: String, default: 'Abhi Studio Design Team' },
    joinery: { type: String, default: 'Traditional mortise and tenon joinery' },
    architecturalNotes: { type: String, default: '' },
    badge: { type: String, default: '' },
    weightKg: { type: Number, default: 35 },
  },
  { timestamps: true }
);

export const ProductModel =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

// -------------------------------------------------------------
// 2. ORDER MODEL
// -------------------------------------------------------------
const CartItemSchema = new Schema(
  {
    id: { type: String, required: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    basePrice: { type: Number, required: true },
    selectedWoodOption: { type: String, default: '' },
    selectedFabricOption: { type: String, default: '' },
    optionExtraPrice: { type: Number, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    clientPinCode: { type: String, required: true },
    clientCity: { type: String, required: true },
    items: [CartItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    gst: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    whiteGloveDelivery: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'emi', 'cod'],
      default: 'upi',
    },
    paymentDetails: {
      upiId: { type: String, default: '' },
      cardLast4: { type: String, default: '' },
      bankName: { type: String, default: '' },
      emiMonths: { type: Number, default: 0 },
      paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'cod'],
        default: 'paid',
      },
    },
    status: {
      type: String,
      enum: ['submitted', 'confirmed', 'in_production', 'dispatched', 'delivered'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

export const OrderModel =
  mongoose.models.Order || mongoose.model('Order', OrderSchema);

// -------------------------------------------------------------
// 3. SHOWROOM VISIT MODEL
// -------------------------------------------------------------
const ShowroomVisitSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    showroom: { type: String, required: true },
    visitDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ShowroomVisitModel =
  mongoose.models.ShowroomVisit ||
  mongoose.model('ShowroomVisit', ShowroomVisitSchema);

// -------------------------------------------------------------
// 4. SWATCH REQUEST MODEL
// -------------------------------------------------------------
const SwatchRequestSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pinCode: { type: String, required: true },
    address: { type: String, required: true },
    selectedMaterials: [{ type: String }],
  },
  { timestamps: true }
);

export const SwatchRequestModel =
  mongoose.models.SwatchRequest ||
  mongoose.model('SwatchRequest', SwatchRequestSchema);

// -------------------------------------------------------------
// 5. CHAT INQUIRY MODEL
// -------------------------------------------------------------
const ChatInquirySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    clientName: { type: String, required: true },
    clientContact: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, default: 'Store Inquiry' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const ChatInquiryModel =
  mongoose.models.ChatInquiry ||
  mongoose.model('ChatInquiry', ChatInquirySchema);
