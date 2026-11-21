import {
  Edit3,
  FileText,
  GraduationCap,
  Images,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  School,
  Settings,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { mediaUrl } from "../utils/media";

const applicantStatuses = ["baru", "diverifikasi", "diterima", "ditolak", "cadangan", "daftar_ulang"];
const paymentTypes = ["pendaftaran", "daftar_ulang", "seragam", "lainnya"];
const paymentMethods = ["tunai", "transfer", "qris"];
const paymentStatuses = ["belum_lunas", "sebagian", "lunas", "ditolak"];
const paymentTypeLabels = {
  pendaftaran: "Pendaftaran",
  daftar_ulang: "Daftar ulang / lunas",
  seragam: "DP seragam / seragam",
  lainnya: "Lainnya",
};
const genderLabels = {
  L: "Laki-laki",
  P: "Perempuan",
};
const postTypes = ["berita", "pengumuman", "karya_santri"];
const programCategories = ["kepesantrenan", "tahunan", "ekstrakurikuler"];
const galleryCategories = ["kegiatan", "pesantren", "ekstrakurikuler", "fasilitas", "tahunan"];
const adminRoles = ["super_admin", "ppdb_admin", "content_admin"];
const roleLabels = {
  super_admin: "Admin Utama",
  ppdb_admin: "Admin PPDB",
  content_admin: "Admin Konten",
};
const emptyPostForm = {
  id: null,
  type: "berita",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "/assets/default.png",
  author: "Tim Redaksi",
  published_at: "",
  status: "draft",
  is_featured: 0,
};
const emptyProgramForm = {
  id: null,
  category: "kepesantrenan",
  title: "",
  description: "",
  image: "/assets/default.png",
  icon: "BookOpen",
  sort_order: 0,
  is_active: 1,
};
const emptyProfileForm = {
  school_name: "",
  description: "",
  address: "",
  npsn: "",
  status: "",
  level: "",
  founded_year: "",
  accreditation: "",
  teachers_count: "",
  students_count: "",
  vision: "",
  mission: "",
};
const emptyLeaderForm = {
  id: null,
  role: "",
  name: "",
  title: "",
  quote: "",
  photo: "/assets/default.png",
  sort_order: 0,
  is_active: 1,
};
const emptyFacilityForm = {
  id: null,
  name: "",
  description: "",
  image: "/assets/default.png",
  icon: "Building2",
  sort_order: 0,
  is_active: 1,
};
const emptyGalleryForm = {
  id: null,
  title: "",
  category: "kegiatan",
  description: "",
  image: "/assets/default.png",
  taken_at: "",
  sort_order: 0,
  is_active: 1,
};
const emptySettingsForm = {
  school_name: "",
  footer_description: "",
  address: "",
  phone: "",
  email: "",
  service_hours: "",
  instagram_url: "",
  youtube_url: "",
  cta_title: "",
  cta_description: "",
  hero_image: "/assets/default.png",
  students_count: "500+",
  teachers_count: "40+",
  achievements_count: "20+",
  campuses_count: "1",
};
const emptyPpdbSettingsForm = {
  academic_year: "2026/2027",
  registration_start: "",
  registration_end: "",
  quota_text: "Kuota terbatas",
  location: "Pabelan, Kabupaten Semarang",
  brochure_url: "",
  is_open: 0,
};
const emptyAdminUserForm = {
  id: null,
  name: "",
  email: "",
  password: "",
  role: "content_admin",
  is_active: 1,
};
const emptyPaymentForm = {
  payment_type: "pendaftaran",
  amount: "",
  method: "tunai",
  status: "lunas",
  officer_name: "",
  payer_signature_type: "manual",
  notes: "",
  paid_at: "",
};
const emptyApplicantForm = {
  full_name: "",
  nisn: "",
  gender: "L",
  birth_place: "",
  birth_date: "",
  address: "",
  previous_school: "",
  parent_name: "",
  whatsapp: "",
  status: "baru",
  notes: "",
};

function createEmptyApplicantPaymentForm() {
  return {
    method: "tunai",
    status: "lunas",
    officer_name: "",
    payer_signature_type: "manual",
    notes: "",
    paid_at: "",
    items: paymentTypes.reduce((items, type) => ({
      ...items,
      [type]: {
        checked: false,
        amount: "",
      },
    }), {}),
  };
}

function formatLabel(value) {
  return value.replaceAll("_", " ");
}

function getToken() {
  return localStorage.getItem("smabda_admin_token");
}

function getStoredRole() {
  return localStorage.getItem("smabda_admin_role") || "super_admin";
}

function toDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  return String(value).replace(" ", "T").slice(0, 16);
}

function formatAdminDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(String(value).replace(" ", "T")));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function createPaymentBatchNumber() {
  const stamp = new Date().toISOString().replaceAll("-", "").replace("T", "-").slice(0, 15).replaceAll(":", "");
  const suffix = Math.floor(Math.random() * 900) + 100;

  return `KWT-${stamp}-${suffix}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function defaultTabForRole(role) {
  if (role === "ppdb_admin") {
    return "ppdb-register";
  }

  if (role === "content_admin") {
    return "posts";
  }

  return "ppdb-register";
}

export default function AdminDashboardPage() {
  const adminRole = getStoredRole();
  const canManagePpdb = ["super_admin", "ppdb_admin"].includes(adminRole);
  const canManagePosts = ["super_admin", "content_admin"].includes(adminRole);
  const canManageSite = adminRole === "super_admin";
  const [activeTab, setActiveTab] = useState(() => defaultTabForRole(getStoredRole()));
  const [applicants, setApplicants] = useState([]);
  const [posts, setPosts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [applicantStatusFilter, setApplicantStatusFilter] = useState("semua");
  const [applicantGenderFilter, setApplicantGenderFilter] = useState("semua");
  const [applicantSearch, setApplicantSearch] = useState("");
  const [postFilter, setPostFilter] = useState("semua");
  const [postStatusFilter, setPostStatusFilter] = useState("semua");
  const [programFilter, setProgramFilter] = useState("semua");
  const [galleryFilter, setGalleryFilter] = useState("semua");
  const [postForm, setPostForm] = useState(emptyPostForm);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantDetailStatus, setApplicantDetailStatus] = useState("baru");
  const [applicantDetailNotes, setApplicantDetailNotes] = useState("");
  const [applicantPayments, setApplicantPayments] = useState([]);
  const [paymentReports, setPaymentReports] = useState([]);
  const [selectedPaymentReport, setSelectedPaymentReport] = useState(null);
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);
  const [applicantForm, setApplicantForm] = useState(emptyApplicantForm);
  const [applicantPaymentForm, setApplicantPaymentForm] = useState(createEmptyApplicantPaymentForm);
  const [programForm, setProgramForm] = useState(emptyProgramForm);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [leaderForm, setLeaderForm] = useState(emptyLeaderForm);
  const [facilityForm, setFacilityForm] = useState(emptyFacilityForm);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [settingsForm, setSettingsForm] = useState(emptySettingsForm);
  const [ppdbSettingsForm, setPpdbSettingsForm] = useState(emptyPpdbSettingsForm);
  const [adminUserForm, setAdminUserForm] = useState(emptyAdminUserForm);
  const [message, setMessage] = useState("");
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingLeader, setIsSavingLeader] = useState(false);
  const [isSavingFacility, setIsSavingFacility] = useState(false);
  const [isLoadingGalleries, setIsLoadingGalleries] = useState(false);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingPpdbSettings, setIsSavingPpdbSettings] = useState(false);
  const [isLoadingAdminUsers, setIsLoadingAdminUsers] = useState(false);
  const [isSavingAdminUser, setIsSavingAdminUser] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isSavingApplicant, setIsSavingApplicant] = useState(false);
  const [isLoadingPaymentReports, setIsLoadingPaymentReports] = useState(false);
  const [isSavingPaymentReport, setIsSavingPaymentReport] = useState(false);
  const adminName = localStorage.getItem("smabda_admin_name") || "Admin";
  const applicantPaymentTotal = paymentTypes.reduce((total, type) => {
    const item = applicantPaymentForm.items[type];

    if (!item?.checked) {
      return total;
    }

    return total + Number(item.amount || 0);
  }, 0);

  function handleAuthError(error) {
    setMessage(error.message);

    if (error.message.toLowerCase().includes("token")) {
      localStorage.removeItem("smabda_admin_token");
      window.location.hash = "#admin-login";
    }
  }

  async function fetchApplicants() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setIsLoadingApplicants(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data pendaftar");
      }

      setApplicants(result.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoadingApplicants(false);
    }
  }

  async function fetchPosts(type = postFilter, status = postStatusFilter) {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    const params = new URLSearchParams();

    if (type !== "semua") {
      params.set("type", type);
    }

    if (status !== "semua") {
      params.set("status", status);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    setIsLoadingPosts(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/posts${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data konten");
      }

      setPosts(result.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function fetchPrograms(category = programFilter) {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    const query = category === "semua" ? "" : `?category=${category}`;
    setIsLoadingPrograms(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data program");
      }

      setPrograms(result.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoadingPrograms(false);
    }
  }

  async function fetchSchoolProfile() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/school-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil profil sekolah");
      }

      setProfileForm({ ...emptyProfileForm, ...(result.data || {}) });
    } catch (error) {
      handleAuthError(error);
    }
  }

  async function fetchProfileLeaders() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile-leaders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data sambutan");
      }

      setLeaders(result.data || []);
    } catch (error) {
      handleAuthError(error);
    }
  }

  async function fetchSchoolFacilities() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/school-facilities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data fasilitas");
      }

      setFacilities(result.data || []);
    } catch (error) {
      handleAuthError(error);
    }
  }

  async function fetchGalleries(category = galleryFilter) {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    const query = category === "semua" ? "" : `?category=${category}`;
    setIsLoadingGalleries(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/galleries${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data galeri");
      }

      setGalleries(result.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoadingGalleries(false);
    }
  }

  async function fetchSiteSettings() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/site-settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil pengaturan website");
      }

      setSettingsForm({ ...emptySettingsForm, ...(result.data || {}) });
    } catch (error) {
      handleAuthError(error);
    }
  }

  async function fetchPpdbSettings() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil pengaturan PPDB");
      }

      setPpdbSettingsForm({ ...emptyPpdbSettingsForm, ...(result.data || {}) });
    } catch (error) {
      handleAuthError(error);
    }
  }

  async function fetchAdminUsers() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setIsLoadingAdminUsers(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data admin");
      }

      setAdminUsers(result.data || []);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoadingAdminUsers(false);
    }
  }

  async function fetchApplicantPayments(applicantId) {
    const token = getToken();

    if (!applicantId || !token) {
      return;
    }

    setIsLoadingPayments(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/applicants/${applicantId}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data pembayaran");
      }

      setApplicantPayments(result.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoadingPayments(false);
    }
  }

  async function fetchPaymentReports() {
    const token = getToken();

    if (!token) {
      window.location.hash = "#admin-login";
      return;
    }

    setIsLoadingPaymentReports(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/payment-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil riwayat rekap");
      }

      setPaymentReports(result.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoadingPaymentReports(false);
    }
  }

  async function updateApplicantStatus(id, status, notes = "") {
    const token = getToken();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/applicants/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status gagal diperbarui");
      }

      setApplicants((current) => current.map((item) => (item.id === result.data.id ? result.data : item)));
      setSelectedApplicant((current) => (current?.id === result.data.id ? result.data : current));
      setMessage("Status pendaftar berhasil diperbarui.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveApplicant(event) {
    event.preventDefault();
    const token = getToken();
    setIsSavingApplicant(true);
    setMessage("");
    let createdApplicant = null;
    const selectedPayments = paymentTypes
      .map((type) => ({
        payment_type: type,
        amount: applicantPaymentForm.items?.[type]?.amount || "",
      }))
      .filter((item) => Number(item.amount || 0) > 0);
    const paymentBatchNumber = selectedPayments.length > 0 ? createPaymentBatchNumber() : "";

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/applicants`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicantForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Pendaftar gagal ditambahkan");
      }

      createdApplicant = result.data;
      setApplicants((current) => [createdApplicant, ...current]);

      for (const paymentItem of selectedPayments) {
        const paymentResponse = await fetch(`${API_BASE_URL}/admin/ppdb/applicants/${createdApplicant.id}/payments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_type: paymentItem.payment_type,
            amount: paymentItem.amount,
            method: applicantPaymentForm.method,
            status: applicantPaymentForm.status,
            batch_number: paymentBatchNumber,
            officer_name: applicantPaymentForm.officer_name || adminName,
            payer_signature_type: applicantPaymentForm.payer_signature_type,
            notes: applicantPaymentForm.notes,
            paid_at: applicantPaymentForm.paid_at,
          }),
        });
        const paymentResult = await paymentResponse.json();

        if (!paymentResponse.ok) {
          openApplicantDetail(createdApplicant);
          throw new Error(paymentResult.message || "Pendaftar tersimpan, tetapi pembayaran awal gagal disimpan");
        }
      }

      setApplicantForm(emptyApplicantForm);
      setApplicantPaymentForm(createEmptyApplicantPaymentForm());
      setActiveTab("ppdb-applicants");
      openApplicantDetail(createdApplicant);
      setMessage(`Pendaftar berhasil ditambahkan dengan nomor ${createdApplicant.registration_number}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingApplicant(false);
    }
  }

  function updateApplicantPaymentItem(type, patch) {
    setApplicantPaymentForm((current) => ({
      ...current,
      items: {
        ...current.items,
        [type]: {
          ...current.items[type],
          ...patch,
        },
      },
    }));
  }

  function openApplicantDetail(applicant) {
    setSelectedApplicant(applicant);
    setApplicantDetailStatus(applicant.status || "baru");
    setApplicantDetailNotes(applicant.notes || "");
    setPaymentForm({ ...emptyPaymentForm, officer_name: adminName, paid_at: toDateTimeLocal(new Date().toISOString()) });
    fetchApplicantPayments(applicant.id);
  }

  async function saveApplicantDetail(event) {
    event.preventDefault();

    if (!selectedApplicant) {
      return;
    }

    await updateApplicantStatus(selectedApplicant.id, applicantDetailStatus, applicantDetailNotes);
  }

  async function saveApplicantPayment(event) {
    event.preventDefault();

    if (!selectedApplicant) {
      return;
    }

    const token = getToken();
    setIsSavingPayment(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/applicants/${selectedApplicant.id}/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Pembayaran gagal disimpan");
      }

      setPaymentForm({ ...emptyPaymentForm, officer_name: adminName, paid_at: toDateTimeLocal(new Date().toISOString()) });
      setMessage("Pembayaran berhasil disimpan.");
      await fetchApplicantPayments(selectedApplicant.id);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingPayment(false);
    }
  }

  async function createPaymentReport() {
    const token = getToken();
    setIsSavingPaymentReport(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/payment-reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: "Rekap pembayaran PPDB" }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Rekap pembayaran gagal dibuat");
      }

      setPaymentReports((current) => [result.data, ...current]);
      setSelectedPaymentReport({ ...result.data, items: result.items || [] });
      setMessage(`Rekap ${result.data.report_number} berhasil dibuat.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingPaymentReport(false);
    }
  }

  async function openPaymentReport(report) {
    const token = getToken();
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/payment-reports/${report.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Detail rekap gagal dibuka");
      }

      setSelectedPaymentReport({ ...result.data, items: result.items || [] });
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function savePost(event) {
    await savePostPayload(postForm, event);
  }

  async function savePostAs(status) {
    const form = document.querySelector("[data-admin-post-form]");

    if (!form?.reportValidity()) {
      return;
    }

    await savePostPayload({ ...postForm, status }, { preventDefault() {} });
  }

  async function savePostPayload(payload, event) {
    event.preventDefault();
    const token = getToken();
    const isEditing = Boolean(payload.id);
    const body = {
      ...payload,
      published_at: payload.published_at ? String(payload.published_at).replace("T", " ") : undefined,
    };

    if (!body.published_at) {
      delete body.published_at;
    }

    setIsSavingPost(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/posts${isEditing ? `/${body.id}` : ""}`, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Konten gagal disimpan");
      }

      setPostForm(emptyPostForm);
      setMessage(isEditing ? "Konten berhasil diperbarui." : "Konten berhasil ditambahkan.");
      await fetchPosts();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingPost(false);
    }
  }

  async function uploadCoverImage(file) {
    const token = getToken();

    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("image", file);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gambar gagal diunggah");
      }

      setPostForm((current) => ({ ...current, cover_image: result.data.url }));
      setMessage("Gambar berhasil diunggah.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function uploadProgramImage(file) {
    const token = getToken();

    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("image", file);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gambar gagal diunggah");
      }

      setProgramForm((current) => ({ ...current, image: result.data.url }));
      setMessage("Gambar program berhasil diunggah.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function uploadLeaderPhoto(file) {
    const token = getToken();

    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("image", file);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Foto gagal diunggah");
      }

      setLeaderForm((current) => ({ ...current, photo: result.data.url }));
      setMessage("Foto sambutan berhasil diunggah.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function uploadFacilityImage(file) {
    const token = getToken();

    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("image", file);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gambar gagal diunggah");
      }

      setFacilityForm((current) => ({ ...current, image: result.data.url }));
      setMessage("Gambar fasilitas berhasil diunggah.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function uploadGalleryImage(file) {
    const token = getToken();

    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("image", file);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gambar gagal diunggah");
      }

      setGalleryForm((current) => ({ ...current, image: result.data.url }));
      setMessage("Gambar galeri berhasil diunggah.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function uploadHeroImage(file) {
    const token = getToken();

    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("image", file);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gambar hero gagal diunggah");
      }

      setSettingsForm((current) => ({ ...current, hero_image: result.data.url }));
      setMessage("Gambar hero berhasil diunggah.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveProgram(event) {
    event.preventDefault();
    const token = getToken();
    const isEditing = Boolean(programForm.id);
    setIsSavingProgram(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs${isEditing ? `/${programForm.id}` : ""}`, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Program gagal disimpan");
      }

      setProgramForm(emptyProgramForm);
      setMessage(isEditing ? "Program berhasil diperbarui." : "Program berhasil ditambahkan.");
      await fetchPrograms();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingProgram(false);
    }
  }

  async function deleteProgram(id) {
    const token = getToken();

    if (!window.confirm("Hapus program ini?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/programs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Program gagal dihapus");
      }

      setPrograms((current) => current.filter((program) => program.id !== id));
      setMessage("Program berhasil dihapus.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveSchoolProfile(event) {
    event.preventDefault();
    const token = getToken();
    setIsSavingProfile(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/school-profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profil sekolah gagal disimpan");
      }

      setProfileForm({ ...emptyProfileForm, ...(result.data || {}) });
      setMessage("Profil sekolah berhasil diperbarui.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function saveProfileLeader(event) {
    event.preventDefault();
    const token = getToken();
    const isEditing = Boolean(leaderForm.id);
    setIsSavingLeader(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile-leaders${isEditing ? `/${leaderForm.id}` : ""}`, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaderForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Sambutan gagal disimpan");
      }

      setLeaderForm(emptyLeaderForm);
      setMessage(isEditing ? "Sambutan berhasil diperbarui." : "Sambutan berhasil ditambahkan.");
      await fetchProfileLeaders();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingLeader(false);
    }
  }

  async function deleteProfileLeader(id) {
    const token = getToken();

    if (!window.confirm("Hapus sambutan ini?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile-leaders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Sambutan gagal dihapus");
      }

      setLeaders((current) => current.filter((leader) => leader.id !== id));
      setMessage("Sambutan berhasil dihapus.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveSchoolFacility(event) {
    event.preventDefault();
    const token = getToken();
    const isEditing = Boolean(facilityForm.id);
    setIsSavingFacility(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/school-facilities${isEditing ? `/${facilityForm.id}` : ""}`, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facilityForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Fasilitas gagal disimpan");
      }

      setFacilityForm(emptyFacilityForm);
      setMessage(isEditing ? "Fasilitas berhasil diperbarui." : "Fasilitas berhasil ditambahkan.");
      await fetchSchoolFacilities();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingFacility(false);
    }
  }

  async function deleteSchoolFacility(id) {
    const token = getToken();

    if (!window.confirm("Hapus fasilitas ini?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/school-facilities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Fasilitas gagal dihapus");
      }

      setFacilities((current) => current.filter((facility) => facility.id !== id));
      setMessage("Fasilitas berhasil dihapus.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveGallery(event) {
    event.preventDefault();
    const token = getToken();
    const isEditing = Boolean(galleryForm.id);
    setIsSavingGallery(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/galleries${isEditing ? `/${galleryForm.id}` : ""}`, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Galeri gagal disimpan");
      }

      setGalleryForm(emptyGalleryForm);
      setMessage(isEditing ? "Galeri berhasil diperbarui." : "Galeri berhasil ditambahkan.");
      await fetchGalleries();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingGallery(false);
    }
  }

  async function deleteGallery(id) {
    const token = getToken();

    if (!window.confirm("Hapus galeri ini?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/galleries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Galeri gagal dihapus");
      }

      setGalleries((current) => current.filter((gallery) => gallery.id !== id));
      setMessage("Galeri berhasil dihapus.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveSiteSettings(event) {
    event.preventDefault();
    const token = getToken();
    setIsSavingSettings(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/site-settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Pengaturan website gagal disimpan");
      }

      setSettingsForm({ ...emptySettingsForm, ...(result.data || {}) });
      setMessage("Pengaturan website berhasil diperbarui.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function savePpdbSettings(event) {
    event.preventDefault();
    const token = getToken();
    setIsSavingPpdbSettings(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ppdb/settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ppdbSettingsForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Pengaturan PPDB gagal disimpan");
      }

      setPpdbSettingsForm({ ...emptyPpdbSettingsForm, ...(result.data || {}) });
      setMessage("Pengaturan PPDB berhasil disimpan.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingPpdbSettings(false);
    }
  }

  async function saveAdminUser(event) {
    event.preventDefault();
    const token = getToken();
    const isEditing = Boolean(adminUserForm.id);
    const payload = { ...adminUserForm };

    if (isEditing && !payload.password) {
      delete payload.password;
    }

    setIsSavingAdminUser(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/admins${isEditing ? `/${adminUserForm.id}` : ""}`, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Admin gagal disimpan");
      }

      setAdminUserForm(emptyAdminUserForm);
      setMessage(isEditing ? "Admin berhasil diperbarui." : "Admin berhasil ditambahkan.");
      await fetchAdminUsers();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSavingAdminUser(false);
    }
  }

  async function deleteAdminUser(id) {
    const token = getToken();

    if (!window.confirm("Hapus admin ini?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Admin gagal dihapus");
      }

      setAdminUsers((current) => current.filter((admin) => admin.id !== id));
      setMessage("Admin berhasil dihapus.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deletePost(id) {
    const token = getToken();

    if (!window.confirm("Hapus konten ini?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Konten gagal dihapus");
      }

      setPosts((current) => current.filter((post) => post.id !== id));
      setMessage("Konten berhasil dihapus.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editPost(post) {
    setPostForm({
      id: post.id,
      type: post.type,
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      cover_image: post.cover_image || "/assets/default.png",
      author: post.author || "Tim Redaksi",
      published_at: toDateTimeLocal(post.published_at),
      status: post.status || "draft",
      is_featured: Number(post.is_featured) || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editProgram(program) {
    setProgramForm({
      id: program.id,
      category: program.category,
      title: program.title,
      description: program.description || "",
      image: program.image || "/assets/default.png",
      icon: program.icon || "BookOpen",
      sort_order: Number(program.sort_order) || 0,
      is_active: Number(program.is_active) || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editLeader(leader) {
    setLeaderForm({
      id: leader.id,
      role: leader.role,
      name: leader.name,
      title: leader.title || "",
      quote: leader.quote || "",
      photo: leader.photo || "/assets/default.png",
      sort_order: Number(leader.sort_order) || 0,
      is_active: Number(leader.is_active) || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editFacility(facility) {
    setFacilityForm({
      id: facility.id,
      name: facility.name,
      description: facility.description || "",
      image: facility.image || "/assets/default.png",
      icon: facility.icon || "Building2",
      sort_order: Number(facility.sort_order) || 0,
      is_active: Number(facility.is_active) || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editGallery(gallery) {
    setGalleryForm({
      id: gallery.id,
      title: gallery.title,
      category: gallery.category || "kegiatan",
      description: gallery.description || "",
      image: gallery.image || "/assets/default.png",
      taken_at: gallery.taken_at || "",
      sort_order: Number(gallery.sort_order) || 0,
      is_active: Number(gallery.is_active) || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editAdminUser(admin) {
    setAdminUserForm({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role || "content_admin",
      is_active: Number(admin.is_active) || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function logout() {
    localStorage.removeItem("smabda_admin_token");
    localStorage.removeItem("smabda_admin_name");
    localStorage.removeItem("smabda_admin_role");
    localStorage.removeItem("smabda_admin_id");
    window.location.hash = "#admin-login";
  }

  useEffect(() => {
    if (canManagePpdb) {
      fetchApplicants();
      fetchPaymentReports();
      fetchPpdbSettings();
    }

    if (canManagePosts) {
      fetchPosts("semua");
    }

    if (canManageSite) {
      fetchPrograms("semua");
      fetchGalleries("semua");
      fetchSiteSettings();
      fetchSchoolProfile();
      fetchProfileLeaders();
      fetchSchoolFacilities();
      fetchAdminUsers();
    }
  }, []);

  useEffect(() => {
    if (canManagePosts) {
      fetchPosts(postFilter, postStatusFilter);
    }
  }, [postFilter, postStatusFilter]);

  useEffect(() => {
    if (canManageSite) {
      fetchPrograms(programFilter);
    }
  }, [programFilter]);

  useEffect(() => {
    if (canManageSite) {
      fetchGalleries(galleryFilter);
    }
  }, [galleryFilter]);

  const summaryCards = [];

  if (canManagePpdb) {
    summaryCards.push(
      { icon: UsersRound, label: "Total Pendaftar", value: applicants.length },
      { icon: ShieldCheck, label: "Diverifikasi", value: applicants.filter((item) => item.status === "diverifikasi").length },
      { icon: UsersRound, label: "Diterima", value: applicants.filter((item) => item.status === "diterima").length },
      { icon: UsersRound, label: "Daftar Ulang", value: applicants.filter((item) => item.status === "daftar_ulang").length },
    );
  }

  if (canManagePosts) {
    summaryCards.push(
      { icon: FileText, label: "Total Konten", value: posts.length },
      { icon: FileText, label: "Published", value: posts.filter((item) => item.status === "published").length },
      { icon: FileText, label: "Draft", value: posts.filter((item) => item.status === "draft").length },
      { icon: FileText, label: "Karya Santri", value: posts.filter((item) => item.type === "karya_santri").length },
    );
  }

  if (canManageSite) {
    summaryCards.push(
      { icon: GraduationCap, label: "Total Program", value: programs.length },
      { icon: Images, label: "Total Galeri", value: galleries.length },
      { icon: School, label: "Fasilitas", value: facilities.length },
      { icon: ShieldCheck, label: "Admin Aktif", value: adminUsers.filter((item) => Number(item.is_active)).length },
    );
  }

  const visibleApplicants = applicants.filter((applicant) => {
    const matchesStatus = applicantStatusFilter === "semua" || applicant.status === applicantStatusFilter;
    const matchesGender = applicantGenderFilter === "semua" || applicant.gender === applicantGenderFilter;
    const keyword = applicantSearch.trim().toLowerCase();

    if (!keyword) {
      return matchesStatus && matchesGender;
    }

    const searchableText = [
      applicant.registration_number,
      applicant.full_name,
      applicant.parent_name,
      applicant.previous_school,
      applicant.whatsapp,
      applicant.address,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && matchesGender && searchableText.includes(keyword);
  });

  function exportApplicantsCsv(gender = "semua") {
    const rows = visibleApplicants.filter((applicant) => gender === "semua" || applicant.gender === gender);
    const headers = [
      "No Registrasi",
      "Nama Lengkap",
      "Jenis Kelamin",
      "NISN",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Asal Sekolah",
      "Nama Orang Tua",
      "WhatsApp",
      "Alamat",
      "Status",
      "Tanggal Daftar",
    ];
    const csvRows = [
      headers,
      ...rows.map((applicant) => [
        applicant.registration_number,
        applicant.full_name,
        genderLabels[applicant.gender] || applicant.gender,
        applicant.nisn,
        applicant.birth_place,
        applicant.birth_date,
        applicant.previous_school,
        applicant.parent_name,
        applicant.whatsapp,
        applicant.address,
        formatLabel(applicant.status || ""),
        applicant.created_at,
      ]),
    ];
    const csv = csvRows
      .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const suffix = gender === "L" ? "laki-laki" : gender === "P" ? "perempuan" : "semua";

    link.href = url;
    link.download = `ppdb-${suffix}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function printPaymentReceipt(payment) {
    if (!selectedApplicant) {
      return;
    }

    const receiptPayments = payment.batch_number
      ? applicantPayments.filter((item) => item.batch_number === payment.batch_number)
      : [payment];
    const receiptNumber = payment.batch_number || payment.receipt_number;
    const totalAmount = receiptPayments.reduce((total, item) => total + Number(item.amount || 0), 0);
    const paymentRows = receiptPayments
      .map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(paymentTypeLabels[item.payment_type] || formatLabel(item.payment_type))}</td>
          <td>${escapeHtml(item.notes || "-")}</td>
          <td class="amount">${escapeHtml(formatCurrency(item.amount))}</td>
        </tr>
      `)
      .join("");
    const signatureBlock =
      payment.payer_signature_type === "electronic"
        ? `
          <div class="signature-electronic">
            Ditandatangani secara elektronik oleh:<br>
            <strong>${escapeHtml(selectedApplicant.full_name)}</strong><br>
            ${escapeHtml(formatAdminDate(payment.paid_at))}<br>
            Kode Verifikasi: ${escapeHtml(receiptNumber)}
          </div>
        `
        : '<div class="signature-line"></div>';
    const receiptPart = (copyLabel) => `
      <section class="receipt-part">
        <div class="receipt-head">
          <div>
            <p>SMA Bastren Daarul Ahgaff Pabelan</p>
            <h1>Bukti Pembayaran PPDB</h1>
            <span>${copyLabel}</span>
          </div>
          <strong>${escapeHtml(receiptNumber)}</strong>
        </div>

        <div class="receipt-grid">
          <div><span>No. Pendaftaran</span><b>${escapeHtml(selectedApplicant.registration_number)}</b></div>
          <div><span>Nama Pendaftar</span><b>${escapeHtml(selectedApplicant.full_name)}</b></div>
          <div><span>Jenis Kelamin</span><b>${escapeHtml(genderLabels[selectedApplicant.gender] || "-")}</b></div>
          <div><span>Asal Sekolah</span><b>${escapeHtml(selectedApplicant.previous_school || "-")}</b></div>
          <div><span>Metode</span><b>${escapeHtml(formatLabel(payment.method))}</b></div>
          <div><span>Status</span><b>${escapeHtml(formatLabel(payment.status))}</b></div>
          <div><span>Tanggal Bayar</span><b>${escapeHtml(formatAdminDate(payment.paid_at))}</b></div>
        </div>

        <table class="receipt-items">
          <thead>
            <tr>
              <th>No</th>
              <th>Rincian Pembayaran</th>
              <th>Catatan</th>
              <th>Nominal</th>
            </tr>
          </thead>
          <tbody>
            ${paymentRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Dibayar</td>
              <td class="amount">${escapeHtml(formatCurrency(totalAmount))}</td>
            </tr>
          </tfoot>
        </table>

        <div class="receipt-signatures">
          <div>
            <p>Penerima</p>
            <div class="signature-line"></div>
            <strong>${escapeHtml(payment.officer_name || adminName)}</strong>
          </div>
          <div>
            <p>Pendaftar</p>
            ${signatureBlock}
            <strong>${escapeHtml(selectedApplicant.full_name)}</strong>
          </div>
        </div>
      </section>
    `;
    const printWindow = window.open("", "_blank", "width=900,height=900");

    if (!printWindow) {
      setMessage("Popup cetak diblokir browser. Izinkan popup untuk mencetak bukti.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Bukti Pembayaran ${escapeHtml(receiptNumber)}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #151718; font-family: Arial, sans-serif; }
            .receipt-sheet { display: grid; gap: 10mm; }
            .receipt-part { min-height: 130mm; padding: 8mm; border: 1px solid #214f26; border-radius: 6px; }
            .receipt-cut { border-top: 1px dashed #777; text-align: center; color: #777; font-size: 11px; line-height: 0; }
            .receipt-cut span { background: #fff; padding: 0 8px; position: relative; top: -1px; }
            .receipt-head { display: flex; justify-content: space-between; gap: 16px; border-bottom: 2px solid #214f26; padding-bottom: 10px; }
            .receipt-head p, .receipt-head h1 { margin: 0; }
            .receipt-head p { color: #214f26; font-weight: 700; }
            .receipt-head h1 { margin-top: 4px; font-size: 22px; }
            .receipt-head span { display: inline-block; margin-top: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
            .receipt-head strong { color: #214f26; white-space: nowrap; }
            .receipt-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 18px; margin-top: 14px; }
            .receipt-grid div { display: grid; gap: 3px; }
            .receipt-grid span { color: #5f6760; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .receipt-grid b { font-size: 13px; line-height: 1.35; }
            .receipt-items { width: 100%; margin-top: 14px; border-collapse: collapse; font-size: 12px; }
            .receipt-items th, .receipt-items td { padding: 6px 7px; border: 1px solid #dce2d8; text-align: left; }
            .receipt-items th { color: #214f26; background: #edf1e6; }
            .receipt-items tfoot td { font-weight: 800; }
            .receipt-items .amount { text-align: right; white-space: nowrap; }
            .receipt-signatures { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; margin-top: 20px; text-align: center; }
            .receipt-signatures p { margin: 0 0 8px; font-weight: 700; }
            .signature-line { height: 42px; border-bottom: 1px solid #151718; }
            .signature-electronic { min-height: 42px; padding: 8px; border: 1px solid #dce2d8; border-radius: 5px; font-size: 11px; line-height: 1.45; }
            .receipt-signatures strong { display: block; margin-top: 7px; font-size: 13px; }
          </style>
        </head>
        <body>
          <main class="receipt-sheet">
            ${receiptPart("Bukti untuk Pendaftar")}
            <div class="receipt-cut"><span>potong / sobek di sini</span></div>
            ${receiptPart("Bukti untuk Sekolah")}
          </main>
          <script>
            window.addEventListener("load", () => {
              window.print();
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function exportPaymentReportCsv(report = selectedPaymentReport) {
    if (!report?.items?.length) {
      setMessage("Buka detail rekap terlebih dahulu sebelum export.");
      return;
    }

    const headers = ["No", "No Registrasi", "Nama", "Gender", "Jenis Pembayaran", "Metode", "Tanggal Bayar", "Nominal"];
    const rows = report.items.map((item, index) => [
      index + 1,
      item.registration_number,
      item.applicant_name,
      genderLabels[item.gender] || item.gender,
      paymentTypeLabels[item.payment_type] || formatLabel(item.payment_type),
      formatLabel(item.method),
      item.paid_at,
      item.amount,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${report.report_number}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function printPaymentReport(report = selectedPaymentReport) {
    if (!report?.items?.length) {
      setMessage("Buka detail rekap terlebih dahulu sebelum cetak.");
      return;
    }

    const rows = report.items
      .map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.registration_number)}</td>
          <td>${escapeHtml(item.applicant_name)}</td>
          <td>${escapeHtml(genderLabels[item.gender] || item.gender)}</td>
          <td>${escapeHtml(paymentTypeLabels[item.payment_type] || formatLabel(item.payment_type))}</td>
          <td>${escapeHtml(formatLabel(item.method))}</td>
          <td>${escapeHtml(formatCurrency(item.amount))}</td>
        </tr>
      `)
      .join("");
    const printWindow = window.open("", "_blank", "width=1000,height=900");

    if (!printWindow) {
      setMessage("Popup cetak diblokir browser. Izinkan popup untuk mencetak rekap.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Rekap Pembayaran ${escapeHtml(report.report_number)}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #151718; font-family: Arial, sans-serif; }
            .head { display: flex; justify-content: space-between; gap: 20px; padding-bottom: 12px; border-bottom: 3px solid #214f26; }
            h1, p { margin: 0; }
            h1 { margin-top: 5px; font-size: 24px; }
            .head p { color: #214f26; font-weight: 700; }
            .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0; }
            .summary div { padding: 10px; border: 1px solid #dce2d8; border-radius: 8px; }
            .summary span { display: block; color: #5f6760; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .summary strong { display: block; margin-top: 4px; font-size: 15px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { padding: 7px; border: 1px solid #dce2d8; text-align: left; }
            th { color: #214f26; background: #edf1e6; }
            td:last-child, th:last-child { text-align: right; white-space: nowrap; }
            .signature { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-top: 28px; text-align: center; }
            .line { height: 54px; border-bottom: 1px solid #151718; }
          </style>
        </head>
        <body>
          <div class="head">
            <div>
              <p>SMA Bastren Daarul Ahgaff Pabelan</p>
              <h1>Rekap Pembayaran PPDB</h1>
            </div>
            <strong>${escapeHtml(report.report_number)}</strong>
          </div>
          <section class="summary">
            <div><span>Total Pemasukan</span><strong>${escapeHtml(formatCurrency(report.total_amount))}</strong></div>
            <div><span>Laki-laki</span><strong>${escapeHtml(formatCurrency(report.total_male))}</strong></div>
            <div><span>Perempuan</span><strong>${escapeHtml(formatCurrency(report.total_female))}</strong></div>
            <div><span>Transaksi</span><strong>${escapeHtml(report.transaction_count)}</strong></div>
            <div><span>Pendaftaran</span><strong>${escapeHtml(formatCurrency(report.total_registration))}</strong></div>
            <div><span>Daftar Ulang</span><strong>${escapeHtml(formatCurrency(report.total_reregistration))}</strong></div>
            <div><span>Seragam</span><strong>${escapeHtml(formatCurrency(report.total_uniform))}</strong></div>
            <div><span>Lainnya</span><strong>${escapeHtml(formatCurrency(report.total_other))}</strong></div>
          </section>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>No Registrasi</th>
                <th>Nama</th>
                <th>Gender</th>
                <th>Jenis</th>
                <th>Metode</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <section class="signature">
            <div>
              <p>Dibuat oleh</p>
              <div class="line"></div>
              <strong>${escapeHtml(report.created_by_name || adminName)}</strong>
            </div>
            <div>
              <p>Bendahara</p>
              <div class="line"></div>
              <strong>__________________</strong>
            </div>
          </section>
          <script>window.addEventListener("load", () => window.print());</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-hero">
        <div>
          <p className="admin-eyebrow">Dashboard Admin</p>
          <h1>Selamat datang, {adminName}</h1>
          <p className="admin-muted">
            {roleLabels[adminRole] || "Admin"} - Pantau dan kelola area website sesuai hak akses akun.
          </p>
        </div>
        <div className="admin-dashboard-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={
              ["ppdb-register", "ppdb-applicants"].includes(activeTab)
                ? () => {
                    fetchApplicants();
                    fetchPaymentReports();
                    fetchPpdbSettings();
                  }
                : activeTab === "ppdb-reports"
                  ? fetchPaymentReports
                : activeTab === "posts"
                  ? () => fetchPosts()
                    : activeTab === "programs"
                      ? () => fetchPrograms()
                      : activeTab === "galleries"
                        ? () => fetchGalleries()
                        : activeTab === "settings"
                          ? fetchSiteSettings
                          : activeTab === "admin-users"
                            ? fetchAdminUsers
                    : () => {
                        fetchSchoolProfile();
                        fetchProfileLeaders();
                        fetchSchoolFacilities();
                      }
            }
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button type="button" className="admin-secondary-button" onClick={logout}>
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </section>

      <section className="admin-summary-grid">
        {summaryCards.map(({ icon: Icon, label, value }) => (
          <article key={label}>
            <Icon size={25} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <div className="admin-tabs">
        {canManagePpdb && (
          <>
            <button type="button" className={activeTab === "ppdb-register" ? "active" : ""} onClick={() => setActiveTab("ppdb-register")}>
              <UsersRound size={18} />
              Pendaftaran PPDB
            </button>
            <button type="button" className={activeTab === "ppdb-applicants" ? "active" : ""} onClick={() => setActiveTab("ppdb-applicants")}>
              <FileText size={18} />
              Data Pendaftar
            </button>
            <button type="button" className={activeTab === "ppdb-reports" ? "active" : ""} onClick={() => setActiveTab("ppdb-reports")}>
              <FileText size={18} />
              Rekap Pembayaran
            </button>
          </>
        )}
        {canManagePosts && (
          <button type="button" className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>
            <FileText size={18} />
            Konten Website
          </button>
        )}
        {canManageSite && (
          <>
            <button type="button" className={activeTab === "programs" ? "active" : ""} onClick={() => setActiveTab("programs")}>
              <GraduationCap size={18} />
              Program Unggulan
            </button>
            <button type="button" className={activeTab === "galleries" ? "active" : ""} onClick={() => setActiveTab("galleries")}>
              <Images size={18} />
              Galeri
            </button>
            <button type="button" className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
              <School size={18} />
              Profil Sekolah
            </button>
            <button type="button" className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
              <Settings size={18} />
              Pengaturan
            </button>
            <button type="button" className={activeTab === "admin-users" ? "active" : ""} onClick={() => setActiveTab("admin-users")}>
              <ShieldCheck size={18} />
              Admin
            </button>
          </>
        )}
      </div>

      {activeTab === "ppdb-register" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">PPDB</p>
              <h2>Form Pendaftaran</h2>
              <p className="admin-muted">Input pendaftar baru dan pembayaran awal dalam satu tempat.</p>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>

          <form className="admin-post-form admin-detail-form" onSubmit={savePpdbSettings}>
            <div className="admin-panel-heading">
              <div>
                <p className="admin-eyebrow">Status PPDB Publik</p>
                <h2>{Number(ppdbSettingsForm.is_open) === 1 ? "PPDB Sedang Dibuka" : "PPDB Sedang Ditutup"}</h2>
                <p className="admin-muted">Saat ditutup, form pendaftaran publik tidak tampil dan API pendaftaran ditolak.</p>
              </div>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Number(ppdbSettingsForm.is_open) === 1}
                  onChange={(event) => setPpdbSettingsForm({ ...ppdbSettingsForm, is_open: event.target.checked ? 1 : 0 })}
                />
                <span>Buka PPDB online</span>
              </label>
            </div>
            <div className="admin-form-grid">
              <label>
                <span>Tahun Ajaran</span>
                <input
                  value={ppdbSettingsForm.academic_year}
                  onChange={(event) => setPpdbSettingsForm({ ...ppdbSettingsForm, academic_year: event.target.value })}
                  required
                />
              </label>
              <label>
                <span>Kuota / Keterangan</span>
                <input
                  value={ppdbSettingsForm.quota_text || ""}
                  onChange={(event) => setPpdbSettingsForm({ ...ppdbSettingsForm, quota_text: event.target.value })}
                />
              </label>
              <label>
                <span>Mulai Pendaftaran</span>
                <input
                  type="date"
                  value={ppdbSettingsForm.registration_start || ""}
                  onChange={(event) => setPpdbSettingsForm({ ...ppdbSettingsForm, registration_start: event.target.value })}
                />
              </label>
              <label>
                <span>Akhir Pendaftaran</span>
                <input
                  type="date"
                  value={ppdbSettingsForm.registration_end || ""}
                  onChange={(event) => setPpdbSettingsForm({ ...ppdbSettingsForm, registration_end: event.target.value })}
                />
              </label>
              <label>
                <span>Lokasi</span>
                <input
                  value={ppdbSettingsForm.location || ""}
                  onChange={(event) => setPpdbSettingsForm({ ...ppdbSettingsForm, location: event.target.value })}
                />
              </label>
              <label>
                <span>URL Brosur</span>
                <input
                  value={ppdbSettingsForm.brochure_url || ""}
                  onChange={(event) => setPpdbSettingsForm({ ...ppdbSettingsForm, brochure_url: event.target.value })}
                  placeholder="/assets/brosur-ppdb.pdf"
                />
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingPpdbSettings}>
                <Save size={18} />
                {isSavingPpdbSettings ? "Menyimpan..." : "Simpan Status PPDB"}
              </button>
            </div>
          </form>

          <form className="admin-post-form admin-detail-form" onSubmit={saveApplicant}>
            <div className="admin-panel-heading admin-subsection-heading">
              <div>
                <p className="admin-eyebrow">Input SPMB</p>
                <h2>Tambah Pendaftar & Pembayaran</h2>
                <p className="admin-muted">Untuk pendaftar offline yang datanya diinput sekaligus dari dashboard.</p>
              </div>
            </div>
            <div className="admin-registration-grid">
              <div className="admin-form-card">
                <h3>Data Diri Pendaftar</h3>
                <div className="admin-form-grid">
                  <label>
                    <span>Nama Lengkap</span>
                    <input
                      value={applicantForm.full_name}
                      onChange={(event) => setApplicantForm({ ...applicantForm, full_name: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    <span>NISN</span>
                    <input value={applicantForm.nisn} onChange={(event) => setApplicantForm({ ...applicantForm, nisn: event.target.value })} />
                  </label>
                  <label>
                    <span>Jenis Kelamin</span>
                    <select value={applicantForm.gender} onChange={(event) => setApplicantForm({ ...applicantForm, gender: event.target.value })} required>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </label>
                  <label>
                    <span>Status Awal</span>
                    <select value={applicantForm.status} onChange={(event) => setApplicantForm({ ...applicantForm, status: event.target.value })}>
                      {applicantStatuses.map((status) => (
                        <option value={status} key={status}>
                          {formatLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Tempat Lahir</span>
                    <input value={applicantForm.birth_place} onChange={(event) => setApplicantForm({ ...applicantForm, birth_place: event.target.value })} />
                  </label>
                  <label>
                    <span>Tanggal Lahir</span>
                    <input
                      type="date"
                      value={applicantForm.birth_date}
                      onChange={(event) => setApplicantForm({ ...applicantForm, birth_date: event.target.value })}
                    />
                  </label>
                  <label>
                    <span>Asal Sekolah</span>
                    <input
                      value={applicantForm.previous_school}
                      onChange={(event) => setApplicantForm({ ...applicantForm, previous_school: event.target.value })}
                    />
                  </label>
                  <label>
                    <span>WhatsApp</span>
                    <input
                      value={applicantForm.whatsapp}
                      onChange={(event) => setApplicantForm({ ...applicantForm, whatsapp: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    <span>Orang Tua / Wali</span>
                    <input
                      value={applicantForm.parent_name}
                      onChange={(event) => setApplicantForm({ ...applicantForm, parent_name: event.target.value })}
                      required
                    />
                  </label>
                </div>
                <label>
                  <span>Alamat</span>
                  <textarea rows="3" value={applicantForm.address} onChange={(event) => setApplicantForm({ ...applicantForm, address: event.target.value })} />
                </label>
                <label>
                  <span>Catatan Admin</span>
                  <textarea rows="3" value={applicantForm.notes} onChange={(event) => setApplicantForm({ ...applicantForm, notes: event.target.value })} />
                </label>
              </div>

              <div className="admin-form-card admin-payment-card">
                <h3>Pembayaran Awal</h3>
                <p className="admin-muted">Centang pembayaran yang diterima. Nominal kosong tidak akan disimpan.</p>
                <div className="admin-payment-options">
                  {paymentTypes.map((type) => {
                    const item = applicantPaymentForm.items[type];

                    return (
                      <label className="admin-payment-option" key={type}>
                        <span className="admin-payment-check">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(event) => updateApplicantPaymentItem(type, { checked: event.target.checked })}
                          />
                          <strong>{paymentTypeLabels[type] || formatLabel(type)}</strong>
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={item.amount}
                          disabled={!item.checked}
                          onChange={(event) => updateApplicantPaymentItem(type, { amount: event.target.value, checked: true })}
                          placeholder="Nominal"
                        />
                      </label>
                    );
                  })}
                </div>
                <div className="admin-payment-total">
                  <span>Total yang dibayar</span>
                  <strong>{formatCurrency(applicantPaymentTotal)}</strong>
                </div>
                <div className="admin-form-grid">
                  <label>
                    <span>Metode</span>
                    <select value={applicantPaymentForm.method} onChange={(event) => setApplicantPaymentForm({ ...applicantPaymentForm, method: event.target.value })}>
                      {paymentMethods.map((method) => (
                        <option value={method} key={method}>
                          {formatLabel(method)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Status Pembayaran</span>
                    <select value={applicantPaymentForm.status} onChange={(event) => setApplicantPaymentForm({ ...applicantPaymentForm, status: event.target.value })}>
                      {paymentStatuses.map((status) => (
                        <option value={status} key={status}>
                          {formatLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Nama Penerima</span>
                    <input
                      value={applicantPaymentForm.officer_name}
                      onChange={(event) => setApplicantPaymentForm({ ...applicantPaymentForm, officer_name: event.target.value })}
                      placeholder={adminName}
                    />
                  </label>
                  <label>
                    <span>Waktu Bayar</span>
                    <input
                      type="datetime-local"
                      value={applicantPaymentForm.paid_at}
                      onChange={(event) => setApplicantPaymentForm({ ...applicantPaymentForm, paid_at: event.target.value })}
                    />
                  </label>
                  <label>
                    <span>TTD Pendaftar</span>
                    <select
                      value={applicantPaymentForm.payer_signature_type}
                      onChange={(event) => setApplicantPaymentForm({ ...applicantPaymentForm, payer_signature_type: event.target.value })}
                    >
                      <option value="manual">Manual saat dicetak</option>
                      <option value="electronic">Elektronik dari sistem</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>Catatan Pembayaran</span>
                  <textarea
                    rows="3"
                    value={applicantPaymentForm.notes}
                    onChange={(event) => setApplicantPaymentForm({ ...applicantPaymentForm, notes: event.target.value })}
                  />
                </label>
              </div>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingApplicant}>
                <Save size={18} />
                {isSavingApplicant ? "Menyimpan..." : "Simpan Pendaftar"}
              </button>
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => {
                  setApplicantForm(emptyApplicantForm);
                  setApplicantPaymentForm(createEmptyApplicantPaymentForm());
                }}
              >
                Reset Form
              </button>
            </div>
          </form>
        </section>
      ) : activeTab === "ppdb-applicants" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">PPDB</p>
              <h2>Data Pendaftar</h2>
              <p className="admin-muted">
                Menampilkan {visibleApplicants.length} dari {applicants.length} pendaftar.
              </p>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>
          <div className="admin-content-toolbar">
            <div className="admin-search-field">
              <input
                value={applicantSearch}
                onChange={(event) => setApplicantSearch(event.target.value)}
                placeholder="Cari nama, no. registrasi, asal sekolah, WhatsApp..."
              />
            </div>
            <div className="admin-filter-group">
              <select value={applicantStatusFilter} onChange={(event) => setApplicantStatusFilter(event.target.value)}>
                <option value="semua">Semua status</option>
                {applicantStatuses.map((status) => (
                  <option value={status} key={status}>
                    {formatLabel(status)}
                  </option>
                ))}
              </select>
              <select value={applicantGenderFilter} onChange={(event) => setApplicantGenderFilter(event.target.value)}>
                <option value="semua">Semua gender</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              <button type="button" className="admin-secondary-button" onClick={() => exportApplicantsCsv("semua")}>
                Export Hasil
              </button>
              <button type="button" className="admin-secondary-button" onClick={() => exportApplicantsCsv("L")}>
                Export L
              </button>
              <button type="button" className="admin-secondary-button" onClick={() => exportApplicantsCsv("P")}>
                Export P
              </button>
              {(applicantSearch || applicantStatusFilter !== "semua" || applicantGenderFilter !== "semua") && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => {
                    setApplicantSearch("");
                    setApplicantStatusFilter("semua");
                    setApplicantGenderFilter("semua");
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {isLoadingApplicants ? (
            <p className="admin-muted">Memuat data pendaftar...</p>
          ) : applicants.length === 0 ? (
            <p className="admin-muted">Belum ada pendaftar.</p>
          ) : visibleApplicants.length === 0 ? (
            <p className="admin-muted">Tidak ada pendaftar yang cocok dengan filter.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>No. Registrasi</th>
                    <th>Nama</th>
                    <th>Gender</th>
                    <th>Asal Sekolah</th>
                    <th>WhatsApp</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleApplicants.map((applicant) => (
                    <tr key={applicant.id}>
                      <td>{applicant.registration_number}</td>
                      <td>
                        <strong>{applicant.full_name}</strong>
                        <span>{applicant.parent_name}</span>
                      </td>
                      <td>{genderLabels[applicant.gender] || "-"}</td>
                      <td>{applicant.previous_school || "-"}</td>
                      <td>{applicant.whatsapp}</td>
                      <td>
                        <select value={applicant.status} onChange={(event) => updateApplicantStatus(applicant.id, event.target.value)}>
                          {applicantStatuses.map((status) => (
                            <option value={status} key={status}>
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => openApplicantDetail(applicant)} aria-label="Lihat detail pendaftar">
                            <Edit3 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedApplicant && (
            <section className="admin-detail-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="admin-eyebrow">Detail Pendaftar</p>
                  <h2>{selectedApplicant.full_name}</h2>
                  <p className="admin-muted">{selectedApplicant.registration_number}</p>
                </div>
                <button type="button" className="admin-secondary-button" onClick={() => setSelectedApplicant(null)}>
                  Tutup
                </button>
              </div>

              <div className="admin-detail-grid">
                <div>
                  <span>NISN</span>
                  <strong>{selectedApplicant.nisn || "-"}</strong>
                </div>
                <div>
                  <span>Gender</span>
                  <strong>{genderLabels[selectedApplicant.gender] || "-"}</strong>
                </div>
                <div>
                  <span>Tempat, Tanggal Lahir</span>
                  <strong>{selectedApplicant.birth_place || "-"}, {selectedApplicant.birth_date || "-"}</strong>
                </div>
                <div>
                  <span>Asal Sekolah</span>
                  <strong>{selectedApplicant.previous_school || "-"}</strong>
                </div>
                <div>
                  <span>Orang Tua / Wali</span>
                  <strong>{selectedApplicant.parent_name || "-"}</strong>
                </div>
                <div>
                  <span>WhatsApp</span>
                  <strong>{selectedApplicant.whatsapp || "-"}</strong>
                </div>
                <div className="admin-detail-wide">
                  <span>Alamat</span>
                  <strong>{selectedApplicant.address || "-"}</strong>
                </div>
                <div>
                  <span>Tanggal Daftar</span>
                  <strong>{formatAdminDate(selectedApplicant.created_at)}</strong>
                </div>
              </div>

              <form className="admin-post-form admin-detail-form" onSubmit={saveApplicantDetail}>
                <div className="admin-form-grid">
                  <label>
                    <span>Status</span>
                    <select value={applicantDetailStatus} onChange={(event) => setApplicantDetailStatus(event.target.value)}>
                      {applicantStatuses.map((status) => (
                        <option value={status} key={status}>
                          {formatLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Nomor Registrasi</span>
                    <input value={selectedApplicant.registration_number} readOnly />
                  </label>
                </div>
                <label>
                  <span>Catatan Admin</span>
                  <textarea
                    rows="4"
                    value={applicantDetailNotes}
                    onChange={(event) => setApplicantDetailNotes(event.target.value)}
                    placeholder="Contoh: berkas sudah lengkap, perlu konfirmasi rapor, atau catatan wawancara."
                  />
                </label>
                <div className="admin-form-actions">
                  <button className="admin-primary-button" type="submit">
                    <Save size={18} />
                    Simpan Status & Catatan
                  </button>
                </div>
              </form>

              <div className="admin-panel-heading admin-subsection-heading">
                <div>
                  <p className="admin-eyebrow">Pembayaran</p>
                  <h2>Input Pembayaran Manual</h2>
                </div>
              </div>

              <form className="admin-post-form admin-detail-form" onSubmit={saveApplicantPayment}>
                <div className="admin-form-grid">
                  <label>
                    <span>Jenis Pembayaran</span>
                    <select value={paymentForm.payment_type} onChange={(event) => setPaymentForm({ ...paymentForm, payment_type: event.target.value })}>
                      {paymentTypes.map((type) => (
                        <option value={type} key={type}>
                          {formatLabel(type)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Nominal</span>
                    <input
                      type="number"
                      min="0"
                      value={paymentForm.amount}
                      onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    <span>Metode</span>
                    <select value={paymentForm.method} onChange={(event) => setPaymentForm({ ...paymentForm, method: event.target.value })}>
                      {paymentMethods.map((method) => (
                        <option value={method} key={method}>
                          {formatLabel(method)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Status Pembayaran</span>
                    <select value={paymentForm.status} onChange={(event) => setPaymentForm({ ...paymentForm, status: event.target.value })}>
                      {paymentStatuses.map((status) => (
                        <option value={status} key={status}>
                          {formatLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Nama Penerima</span>
                    <input value={paymentForm.officer_name} onChange={(event) => setPaymentForm({ ...paymentForm, officer_name: event.target.value })} />
                  </label>
                  <label>
                    <span>Waktu Bayar</span>
                    <input type="datetime-local" value={paymentForm.paid_at} onChange={(event) => setPaymentForm({ ...paymentForm, paid_at: event.target.value })} />
                  </label>
                  <label>
                    <span>TTD Pendaftar</span>
                    <select
                      value={paymentForm.payer_signature_type}
                      onChange={(event) => setPaymentForm({ ...paymentForm, payer_signature_type: event.target.value })}
                    >
                      <option value="manual">Manual saat dicetak</option>
                      <option value="electronic">Elektronik dari sistem</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>Catatan Pembayaran</span>
                  <textarea rows="3" value={paymentForm.notes} onChange={(event) => setPaymentForm({ ...paymentForm, notes: event.target.value })} />
                </label>
                <div className="admin-form-actions">
                  <button className="admin-primary-button" type="submit" disabled={isSavingPayment}>
                    <Save size={18} />
                    {isSavingPayment ? "Menyimpan..." : "Simpan Pembayaran"}
                  </button>
                </div>
              </form>

              <div className="admin-table-wrap">
                <table className="admin-table admin-post-table">
                  <thead>
                    <tr>
                      <th>No Bukti</th>
                      <th>Jenis</th>
                      <th>Nominal</th>
                      <th>Metode</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingPayments ? (
                      <tr>
                        <td colSpan="7">Memuat pembayaran...</td>
                      </tr>
                    ) : applicantPayments.length === 0 ? (
                      <tr>
                        <td colSpan="7">Belum ada pembayaran.</td>
                      </tr>
                    ) : (
                      applicantPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td>
                            <strong>{payment.receipt_number}</strong>
                            {payment.batch_number && <span>{payment.batch_number}</span>}
                            <span>{payment.officer_name || "-"}</span>
                          </td>
                          <td>{formatLabel(payment.payment_type)}</td>
                          <td>{formatCurrency(payment.amount)}</td>
                          <td>{formatLabel(payment.method)}</td>
                          <td>
                            <span className={`admin-status ${payment.status === "lunas" ? "published" : ""}`}>{formatLabel(payment.status)}</span>
                          </td>
                          <td>{formatAdminDate(payment.paid_at)}</td>
                          <td>
                            <div className="admin-row-actions">
                              <button type="button" onClick={() => printPaymentReceipt(payment)} aria-label="Cetak bukti pembayaran">
                                <FileText size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>
      ) : activeTab === "ppdb-reports" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Bendahara PPDB</p>
              <h2>Rekap Pembayaran</h2>
              <p className="admin-muted">Buat rekap dari pembayaran yang belum pernah direkap, lalu cetak atau export untuk arsip.</p>
            </div>
            <div className="admin-form-actions">
              {message && <p className="admin-message">{message}</p>}
              <button className="admin-primary-button" type="button" onClick={createPaymentReport} disabled={isSavingPaymentReport}>
                <Save size={18} />
                {isSavingPaymentReport ? "Merekap..." : "Buat Rekap Baru"}
              </button>
            </div>
          </div>

          {isLoadingPaymentReports ? (
            <p className="admin-muted">Memuat riwayat rekap...</p>
          ) : paymentReports.length === 0 ? (
            <p className="admin-muted">Belum ada riwayat rekap pembayaran.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>No Rekap</th>
                    <th>Periode</th>
                    <th>Total</th>
                    <th>L / P</th>
                    <th>Transaksi</th>
                    <th>Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentReports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <strong>{report.report_number}</strong>
                        <span>{report.created_by_name || "-"}</span>
                      </td>
                      <td>
                        {formatAdminDate(report.period_start)}<br />
                        {formatAdminDate(report.period_end)}
                      </td>
                      <td>{formatCurrency(report.total_amount)}</td>
                      <td>
                        <span>L: {formatCurrency(report.total_male)}</span>
                        <span>P: {formatCurrency(report.total_female)}</span>
                      </td>
                      <td>{report.transaction_count}</td>
                      <td>{formatAdminDate(report.created_at)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => openPaymentReport(report)} aria-label="Lihat detail rekap">
                            <Edit3 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedPaymentReport && (
            <section className="admin-detail-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="admin-eyebrow">Detail Rekap</p>
                  <h2>{selectedPaymentReport.report_number}</h2>
                  <p className="admin-muted">
                    {selectedPaymentReport.transaction_count} transaksi - {formatCurrency(selectedPaymentReport.total_amount)}
                  </p>
                </div>
                <div className="admin-form-actions">
                  <button type="button" className="admin-secondary-button" onClick={() => exportPaymentReportCsv()}>
                    Export CSV
                  </button>
                  <button type="button" className="admin-primary-button" onClick={() => printPaymentReport()}>
                    <FileText size={18} />
                    Cetak Rekap
                  </button>
                  <button type="button" className="admin-secondary-button" onClick={() => setSelectedPaymentReport(null)}>
                    Tutup
                  </button>
                </div>
              </div>

              <div className="admin-detail-grid">
                <div>
                  <span>Total Pemasukan</span>
                  <strong>{formatCurrency(selectedPaymentReport.total_amount)}</strong>
                </div>
                <div>
                  <span>Pendaftaran</span>
                  <strong>{formatCurrency(selectedPaymentReport.total_registration)}</strong>
                </div>
                <div>
                  <span>Daftar Ulang</span>
                  <strong>{formatCurrency(selectedPaymentReport.total_reregistration)}</strong>
                </div>
                <div>
                  <span>Seragam</span>
                  <strong>{formatCurrency(selectedPaymentReport.total_uniform)}</strong>
                </div>
                <div>
                  <span>Lainnya</span>
                  <strong>{formatCurrency(selectedPaymentReport.total_other)}</strong>
                </div>
                <div>
                  <span>Per Gender</span>
                  <strong>L {formatCurrency(selectedPaymentReport.total_male)} / P {formatCurrency(selectedPaymentReport.total_female)}</strong>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>No Registrasi</th>
                      <th>Nama</th>
                      <th>Gender</th>
                      <th>Jenis</th>
                      <th>Metode</th>
                      <th>Tanggal</th>
                      <th>Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedPaymentReport.items || []).map((item) => (
                      <tr key={item.id}>
                        <td>{item.registration_number}</td>
                        <td>{item.applicant_name}</td>
                        <td>{genderLabels[item.gender] || item.gender}</td>
                        <td>{paymentTypeLabels[item.payment_type] || formatLabel(item.payment_type)}</td>
                        <td>{formatLabel(item.method)}</td>
                        <td>{formatAdminDate(item.paid_at)}</td>
                        <td>{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>
      ) : activeTab === "posts" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Konten Website</p>
              <h2>Berita, Pengumuman, Karya</h2>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>

          <form className="admin-post-form" data-admin-post-form onSubmit={savePost}>
            <div className="admin-form-grid">
              <label>
                <span>Judul</span>
                <input value={postForm.title} onChange={(event) => setPostForm({ ...postForm, title: event.target.value })} required />
              </label>
              <label>
                <span>Jenis</span>
                <select value={postForm.type} onChange={(event) => setPostForm({ ...postForm, type: event.target.value })}>
                  {postTypes.map((type) => (
                    <option value={type} key={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Penulis</span>
                <input value={postForm.author} onChange={(event) => setPostForm({ ...postForm, author: event.target.value })} />
              </label>
              <label>
                <span>Tanggal Publikasi</span>
                <input
                  type="datetime-local"
                  value={postForm.published_at}
                  onChange={(event) => setPostForm({ ...postForm, published_at: event.target.value })}
                />
              </label>
              <label>
                <span>Status</span>
                <select value={postForm.status} onChange={(event) => setPostForm({ ...postForm, status: event.target.value })}>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>
            </div>
            <label>
              <span>Ringkasan</span>
              <textarea rows="3" value={postForm.excerpt} onChange={(event) => setPostForm({ ...postForm, excerpt: event.target.value })} />
            </label>
            <label>
              <span>Isi Konten</span>
              <textarea rows="7" value={postForm.content} onChange={(event) => setPostForm({ ...postForm, content: event.target.value })} />
            </label>
            <div className="admin-form-grid">
              <label>
                <span>Gambar Cover</span>
                <input value={postForm.cover_image} onChange={(event) => setPostForm({ ...postForm, cover_image: event.target.value })} />
              </label>
              <label>
                <span>Upload Gambar</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadCoverImage(event.target.files[0])} />
              </label>
            </div>
            <div className="admin-form-grid">
              <div className="admin-cover-preview">
                <img src={mediaUrl(postForm.cover_image)} alt="Preview cover" />
              </div>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(postForm.is_featured)}
                  onChange={(event) => setPostForm({ ...postForm, is_featured: event.target.checked ? 1 : 0 })}
                />
                <span>Jadikan berita utama</span>
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingPost}>
                {postForm.id ? <Save size={18} /> : <Plus size={18} />}
                {isSavingPost ? "Menyimpan..." : postForm.id ? "Simpan Perubahan" : "Tambah Konten"}
              </button>
              <button type="button" className="admin-secondary-button" disabled={isSavingPost} onClick={() => savePostAs("draft")}>
                Simpan Draft
              </button>
              <button type="button" className="admin-secondary-button" disabled={isSavingPost} onClick={() => savePostAs("published")}>
                Publish
              </button>
              {postForm.id && (
                <button type="button" className="admin-secondary-button" onClick={() => setPostForm(emptyPostForm)}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>

          <div className="admin-content-toolbar">
            <p className="admin-muted">Daftar konten yang sudah tersimpan di backend.</p>
            <div className="admin-filter-group">
              <select value={postFilter} onChange={(event) => setPostFilter(event.target.value)}>
                <option value="semua">Semua konten</option>
                {postTypes.map((type) => (
                  <option value={type} key={type}>
                    {formatLabel(type)}
                  </option>
                ))}
              </select>
              <select value={postStatusFilter} onChange={(event) => setPostStatusFilter(event.target.value)}>
                <option value="semua">Semua status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {isLoadingPosts ? (
            <p className="admin-muted">Memuat konten...</p>
          ) : posts.length === 0 ? (
            <p className="admin-muted">Belum ada konten.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table admin-post-table">
                <thead>
                  <tr>
                    <th>Konten</th>
                    <th>Jenis</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Penulis</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.title}</strong>
                        <span>{post.excerpt || "-"}</span>
                      </td>
                      <td>{formatLabel(post.type)}</td>
                      <td>
                        <span className={`admin-status ${post.status}`}>{post.status}</span>
                      </td>
                      <td>{formatAdminDate(post.published_at)}</td>
                      <td>{post.author || "-"}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => editPost(post)} aria-label="Edit konten">
                            <Edit3 size={17} />
                          </button>
                          <button type="button" onClick={() => deletePost(post.id)} aria-label="Hapus konten">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : activeTab === "programs" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Program Unggulan</p>
              <h2>Kelola Program Sekolah</h2>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>

          <form className="admin-post-form" onSubmit={saveProgram}>
            <div className="admin-form-grid">
              <label>
                <span>Nama Program</span>
                <input value={programForm.title} onChange={(event) => setProgramForm({ ...programForm, title: event.target.value })} required />
              </label>
              <label>
                <span>Kategori</span>
                <select value={programForm.category} onChange={(event) => setProgramForm({ ...programForm, category: event.target.value })}>
                  {programCategories.map((category) => (
                    <option value={category} key={category}>
                      {formatLabel(category)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Icon</span>
                <input value={programForm.icon} onChange={(event) => setProgramForm({ ...programForm, icon: event.target.value })} />
              </label>
              <label>
                <span>Urutan</span>
                <input
                  type="number"
                  value={programForm.sort_order}
                  onChange={(event) => setProgramForm({ ...programForm, sort_order: Number(event.target.value) })}
                />
              </label>
            </div>
            <label>
              <span>Deskripsi</span>
              <textarea rows="4" value={programForm.description} onChange={(event) => setProgramForm({ ...programForm, description: event.target.value })} />
            </label>
            <div className="admin-form-grid">
              <label>
                <span>Gambar Program</span>
                <input value={programForm.image} onChange={(event) => setProgramForm({ ...programForm, image: event.target.value })} />
              </label>
              <label>
                <span>Upload Gambar</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadProgramImage(event.target.files[0])} />
              </label>
            </div>
            <div className="admin-form-grid">
              <div className="admin-cover-preview">
                <img src={mediaUrl(programForm.image)} alt="Preview program" />
              </div>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(programForm.is_active)}
                  onChange={(event) => setProgramForm({ ...programForm, is_active: event.target.checked ? 1 : 0 })}
                />
                <span>Program aktif dan tampil di website</span>
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingProgram}>
                {programForm.id ? <Save size={18} /> : <Plus size={18} />}
                {isSavingProgram ? "Menyimpan..." : programForm.id ? "Simpan Program" : "Tambah Program"}
              </button>
              {programForm.id && (
                <button type="button" className="admin-secondary-button" onClick={() => setProgramForm(emptyProgramForm)}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>

          <div className="admin-content-toolbar">
            <p className="admin-muted">Daftar program yang tersimpan di backend.</p>
            <select value={programFilter} onChange={(event) => setProgramFilter(event.target.value)}>
              <option value="semua">Semua program</option>
              {programCategories.map((category) => (
                <option value={category} key={category}>
                  {formatLabel(category)}
                </option>
              ))}
            </select>
          </div>

          {isLoadingPrograms ? (
            <p className="admin-muted">Memuat program...</p>
          ) : programs.length === 0 ? (
            <p className="admin-muted">Belum ada program.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table admin-post-table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Kategori</th>
                    <th>Urutan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id}>
                      <td>
                        <strong>{program.title}</strong>
                        <span>{program.description || "-"}</span>
                      </td>
                      <td>{formatLabel(program.category)}</td>
                      <td>{program.sort_order}</td>
                      <td>
                        <span className={`admin-status ${Number(program.is_active) ? "published" : ""}`}>
                          {Number(program.is_active) ? "aktif" : "nonaktif"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => editProgram(program)} aria-label="Edit program">
                            <Edit3 size={17} />
                          </button>
                          <button type="button" onClick={() => deleteProgram(program.id)} aria-label="Hapus program">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : activeTab === "galleries" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Galeri</p>
              <h2>Kelola Dokumentasi Sekolah</h2>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>

          <form className="admin-post-form" onSubmit={saveGallery}>
            <div className="admin-form-grid">
              <label>
                <span>Judul Foto</span>
                <input value={galleryForm.title} onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })} required />
              </label>
              <label>
                <span>Kategori</span>
                <select value={galleryForm.category} onChange={(event) => setGalleryForm({ ...galleryForm, category: event.target.value })}>
                  {galleryCategories.map((category) => (
                    <option value={category} key={category}>
                      {formatLabel(category)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Tanggal Foto</span>
                <input type="date" value={galleryForm.taken_at || ""} onChange={(event) => setGalleryForm({ ...galleryForm, taken_at: event.target.value })} />
              </label>
              <label>
                <span>Urutan</span>
                <input
                  type="number"
                  value={galleryForm.sort_order}
                  onChange={(event) => setGalleryForm({ ...galleryForm, sort_order: Number(event.target.value) })}
                />
              </label>
            </div>
            <label>
              <span>Deskripsi</span>
              <textarea rows="3" value={galleryForm.description} onChange={(event) => setGalleryForm({ ...galleryForm, description: event.target.value })} />
            </label>
            <div className="admin-form-grid">
              <label>
                <span>Gambar Galeri</span>
                <input value={galleryForm.image} onChange={(event) => setGalleryForm({ ...galleryForm, image: event.target.value })} />
              </label>
              <label>
                <span>Upload Gambar</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadGalleryImage(event.target.files[0])} />
              </label>
            </div>
            <div className="admin-form-grid">
              <div className="admin-cover-preview">
                <img src={mediaUrl(galleryForm.image)} alt="Preview galeri" />
              </div>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(galleryForm.is_active)}
                  onChange={(event) => setGalleryForm({ ...galleryForm, is_active: event.target.checked ? 1 : 0 })}
                />
                <span>Foto aktif dan tampil di website</span>
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingGallery}>
                {galleryForm.id ? <Save size={18} /> : <Plus size={18} />}
                {isSavingGallery ? "Menyimpan..." : galleryForm.id ? "Simpan Galeri" : "Tambah Galeri"}
              </button>
              {galleryForm.id && (
                <button type="button" className="admin-secondary-button" onClick={() => setGalleryForm(emptyGalleryForm)}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>

          <div className="admin-content-toolbar">
            <p className="admin-muted">Daftar foto galeri yang tersimpan di backend.</p>
            <select value={galleryFilter} onChange={(event) => setGalleryFilter(event.target.value)}>
              <option value="semua">Semua galeri</option>
              {galleryCategories.map((category) => (
                <option value={category} key={category}>
                  {formatLabel(category)}
                </option>
              ))}
            </select>
          </div>

          {isLoadingGalleries ? (
            <p className="admin-muted">Memuat galeri...</p>
          ) : galleries.length === 0 ? (
            <p className="admin-muted">Belum ada galeri.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table admin-post-table">
                <thead>
                  <tr>
                    <th>Galeri</th>
                    <th>Kategori</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {galleries.map((gallery) => (
                    <tr key={gallery.id}>
                      <td>
                        <strong>{gallery.title}</strong>
                        <span>{gallery.description || "-"}</span>
                      </td>
                      <td>{formatLabel(gallery.category)}</td>
                      <td>{gallery.taken_at || "-"}</td>
                      <td>
                        <span className={`admin-status ${Number(gallery.is_active) ? "published" : ""}`}>
                          {Number(gallery.is_active) ? "aktif" : "nonaktif"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => editGallery(gallery)} aria-label="Edit galeri">
                            <Edit3 size={17} />
                          </button>
                          <button type="button" onClick={() => deleteGallery(gallery.id)} aria-label="Hapus galeri">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : activeTab === "settings" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Pengaturan Website</p>
              <h2>Beranda, Kontak, Footer, dan CTA</h2>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>

          <form className="admin-post-form" onSubmit={saveSiteSettings}>
            <div className="admin-form-grid">
              <label>
                <span>Nama Sekolah</span>
                <input value={settingsForm.school_name} onChange={(event) => setSettingsForm({ ...settingsForm, school_name: event.target.value })} required />
              </label>
              <label>
                <span>Telepon / WhatsApp</span>
                <input value={settingsForm.phone} onChange={(event) => setSettingsForm({ ...settingsForm, phone: event.target.value })} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={settingsForm.email} onChange={(event) => setSettingsForm({ ...settingsForm, email: event.target.value })} />
              </label>
              <label>
                <span>Jam Layanan</span>
                <input value={settingsForm.service_hours} onChange={(event) => setSettingsForm({ ...settingsForm, service_hours: event.target.value })} />
              </label>
              <label>
                <span>Link Instagram</span>
                <input value={settingsForm.instagram_url} onChange={(event) => setSettingsForm({ ...settingsForm, instagram_url: event.target.value })} />
              </label>
              <label>
                <span>Link YouTube</span>
                <input value={settingsForm.youtube_url} onChange={(event) => setSettingsForm({ ...settingsForm, youtube_url: event.target.value })} />
              </label>
            </div>
            <label>
              <span>Alamat</span>
              <textarea rows="3" value={settingsForm.address} onChange={(event) => setSettingsForm({ ...settingsForm, address: event.target.value })} />
            </label>
            <label>
              <span>Deskripsi Footer</span>
              <textarea rows="4" value={settingsForm.footer_description} onChange={(event) => setSettingsForm({ ...settingsForm, footer_description: event.target.value })} />
            </label>
            <div className="admin-form-grid">
              <label>
                <span>Judul CTA</span>
                <input value={settingsForm.cta_title} onChange={(event) => setSettingsForm({ ...settingsForm, cta_title: event.target.value })} />
              </label>
              <label>
                <span>Deskripsi CTA</span>
                <input value={settingsForm.cta_description} onChange={(event) => setSettingsForm({ ...settingsForm, cta_description: event.target.value })} />
              </label>
            </div>
            <div className="admin-panel-heading admin-subsection-heading">
              <div>
                <p className="admin-eyebrow">Beranda</p>
                <h2>Hero dan Statistik</h2>
              </div>
            </div>
            <div className="admin-form-grid">
              <label>
                <span>Gambar Hero</span>
                <input value={settingsForm.hero_image || ""} onChange={(event) => setSettingsForm({ ...settingsForm, hero_image: event.target.value })} />
              </label>
              <label>
                <span>Upload Gambar Hero</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadHeroImage(event.target.files[0])} />
              </label>
            </div>
            <div className="admin-form-grid">
              <div className="admin-cover-preview">
                <img src={mediaUrl(settingsForm.hero_image || "/assets/default.png")} alt="Preview hero beranda" />
              </div>
              <div className="admin-form-grid">
                <label>
                  <span>Jumlah Santri</span>
                  <input value={settingsForm.students_count || ""} onChange={(event) => setSettingsForm({ ...settingsForm, students_count: event.target.value })} />
                </label>
                <label>
                  <span>Jumlah Guru & Staff</span>
                  <input value={settingsForm.teachers_count || ""} onChange={(event) => setSettingsForm({ ...settingsForm, teachers_count: event.target.value })} />
                </label>
                <label>
                  <span>Jumlah Prestasi</span>
                  <input value={settingsForm.achievements_count || ""} onChange={(event) => setSettingsForm({ ...settingsForm, achievements_count: event.target.value })} />
                </label>
                <label>
                  <span>Jumlah Kampus</span>
                  <input value={settingsForm.campuses_count || ""} onChange={(event) => setSettingsForm({ ...settingsForm, campuses_count: event.target.value })} />
                </label>
              </div>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingSettings}>
                <Save size={18} />
                {isSavingSettings ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </form>
        </section>
      ) : activeTab === "admin-users" ? (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Admin Website</p>
              <h2>Kelola Akun dan Hak Akses</h2>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>

          <form className="admin-post-form" onSubmit={saveAdminUser}>
            <div className="admin-form-grid">
              <label>
                <span>Nama Admin</span>
                <input value={adminUserForm.name} onChange={(event) => setAdminUserForm({ ...adminUserForm, name: event.target.value })} required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={adminUserForm.email} onChange={(event) => setAdminUserForm({ ...adminUserForm, email: event.target.value })} required />
              </label>
              <label>
                <span>Password {adminUserForm.id ? "Baru" : ""}</span>
                <input
                  type="password"
                  value={adminUserForm.password}
                  onChange={(event) => setAdminUserForm({ ...adminUserForm, password: event.target.value })}
                  required={!adminUserForm.id}
                  placeholder={adminUserForm.id ? "Kosongkan jika tidak diganti" : ""}
                />
              </label>
              <label>
                <span>Role</span>
                <select value={adminUserForm.role} onChange={(event) => setAdminUserForm({ ...adminUserForm, role: event.target.value })}>
                  {adminRoles.map((role) => (
                    <option value={role} key={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={Boolean(adminUserForm.is_active)}
                onChange={(event) => setAdminUserForm({ ...adminUserForm, is_active: event.target.checked ? 1 : 0 })}
              />
              <span>Akun aktif dan bisa login</span>
            </label>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingAdminUser}>
                {adminUserForm.id ? <Save size={18} /> : <Plus size={18} />}
                {isSavingAdminUser ? "Menyimpan..." : adminUserForm.id ? "Simpan Admin" : "Tambah Admin"}
              </button>
              {adminUserForm.id && (
                <button type="button" className="admin-secondary-button" onClick={() => setAdminUserForm(emptyAdminUserForm)}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>

          {isLoadingAdminUsers ? (
            <p className="admin-muted">Memuat admin...</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table admin-post-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <strong>{admin.name}</strong>
                        <span>{admin.email}</span>
                      </td>
                      <td>{roleLabels[admin.role] || admin.role}</td>
                      <td>
                        <span className={`admin-status ${Number(admin.is_active) ? "published" : ""}`}>
                          {Number(admin.is_active) ? "aktif" : "nonaktif"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => editAdminUser(admin)} aria-label="Edit admin">
                            <Edit3 size={17} />
                          </button>
                          <button type="button" onClick={() => deleteAdminUser(admin.id)} aria-label="Hapus admin">
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Profil Sekolah</p>
              <h2>Data Utama Sekolah</h2>
            </div>
            {message && <p className="admin-message">{message}</p>}
          </div>

          <form className="admin-post-form" onSubmit={saveSchoolProfile}>
            <div className="admin-form-grid">
              <label>
                <span>Nama Sekolah</span>
                <input value={profileForm.school_name} onChange={(event) => setProfileForm({ ...profileForm, school_name: event.target.value })} required />
              </label>
              <label>
                <span>NPSN</span>
                <input value={profileForm.npsn} onChange={(event) => setProfileForm({ ...profileForm, npsn: event.target.value })} />
              </label>
              <label>
                <span>Status</span>
                <input value={profileForm.status} onChange={(event) => setProfileForm({ ...profileForm, status: event.target.value })} />
              </label>
              <label>
                <span>Jenjang</span>
                <input value={profileForm.level} onChange={(event) => setProfileForm({ ...profileForm, level: event.target.value })} />
              </label>
              <label>
                <span>Tahun Berdiri</span>
                <input value={profileForm.founded_year} onChange={(event) => setProfileForm({ ...profileForm, founded_year: event.target.value })} />
              </label>
              <label>
                <span>Akreditasi</span>
                <input value={profileForm.accreditation} onChange={(event) => setProfileForm({ ...profileForm, accreditation: event.target.value })} />
              </label>
              <label>
                <span>Jumlah Guru</span>
                <input value={profileForm.teachers_count} onChange={(event) => setProfileForm({ ...profileForm, teachers_count: event.target.value })} />
              </label>
              <label>
                <span>Jumlah Siswa</span>
                <input value={profileForm.students_count} onChange={(event) => setProfileForm({ ...profileForm, students_count: event.target.value })} />
              </label>
            </div>
            <label>
              <span>Deskripsi Sekolah</span>
              <textarea rows="4" value={profileForm.description} onChange={(event) => setProfileForm({ ...profileForm, description: event.target.value })} />
            </label>
            <label>
              <span>Alamat</span>
              <textarea rows="3" value={profileForm.address} onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })} />
            </label>
            <label>
              <span>Visi</span>
              <textarea rows="3" value={profileForm.vision} onChange={(event) => setProfileForm({ ...profileForm, vision: event.target.value })} />
            </label>
            <label>
              <span>Misi</span>
              <textarea rows="6" value={profileForm.mission} onChange={(event) => setProfileForm({ ...profileForm, mission: event.target.value })} />
            </label>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingProfile}>
                <Save size={18} />
                {isSavingProfile ? "Menyimpan..." : "Simpan Profil Sekolah"}
              </button>
            </div>
          </form>

          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Sambutan Tokoh</p>
              <h2>Pendiri, Yayasan, Kepala Sekolah</h2>
            </div>
          </div>

          <form className="admin-post-form" onSubmit={saveProfileLeader}>
            <div className="admin-form-grid">
              <label>
                <span>Label Sambutan</span>
                <input value={leaderForm.role} onChange={(event) => setLeaderForm({ ...leaderForm, role: event.target.value })} required />
              </label>
              <label>
                <span>Nama Tokoh</span>
                <input value={leaderForm.name} onChange={(event) => setLeaderForm({ ...leaderForm, name: event.target.value })} required />
              </label>
              <label>
                <span>Jabatan / Keterangan</span>
                <input value={leaderForm.title} onChange={(event) => setLeaderForm({ ...leaderForm, title: event.target.value })} />
              </label>
              <label>
                <span>Urutan</span>
                <input
                  type="number"
                  value={leaderForm.sort_order}
                  onChange={(event) => setLeaderForm({ ...leaderForm, sort_order: Number(event.target.value) })}
                />
              </label>
            </div>
            <label>
              <span>Isi Sambutan</span>
              <textarea rows="4" value={leaderForm.quote} onChange={(event) => setLeaderForm({ ...leaderForm, quote: event.target.value })} />
            </label>
            <div className="admin-form-grid">
              <label>
                <span>Foto</span>
                <input value={leaderForm.photo} onChange={(event) => setLeaderForm({ ...leaderForm, photo: event.target.value })} />
              </label>
              <label>
                <span>Upload Foto</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadLeaderPhoto(event.target.files[0])} />
              </label>
            </div>
            <div className="admin-form-grid">
              <div className="admin-cover-preview">
                <img src={mediaUrl(leaderForm.photo)} alt="Preview tokoh" />
              </div>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(leaderForm.is_active)}
                  onChange={(event) => setLeaderForm({ ...leaderForm, is_active: event.target.checked ? 1 : 0 })}
                />
                <span>Sambutan aktif dan tampil di website</span>
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingLeader}>
                {leaderForm.id ? <Save size={18} /> : <Plus size={18} />}
                {isSavingLeader ? "Menyimpan..." : leaderForm.id ? "Simpan Sambutan" : "Tambah Sambutan"}
              </button>
              {leaderForm.id && (
                <button type="button" className="admin-secondary-button" onClick={() => setLeaderForm(emptyLeaderForm)}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table admin-post-table">
              <thead>
                <tr>
                  <th>Sambutan</th>
                  <th>Tokoh</th>
                  <th>Urutan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader) => (
                  <tr key={leader.id}>
                    <td>
                      <strong>{leader.role}</strong>
                      <span>{leader.quote || "-"}</span>
                    </td>
                    <td>
                      <strong>{leader.name}</strong>
                      <span>{leader.title || "-"}</span>
                    </td>
                    <td>{leader.sort_order}</td>
                    <td>
                      <span className={`admin-status ${Number(leader.is_active) ? "published" : ""}`}>
                        {Number(leader.is_active) ? "aktif" : "nonaktif"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" onClick={() => editLeader(leader)} aria-label="Edit sambutan">
                          <Edit3 size={17} />
                        </button>
                        <button type="button" onClick={() => deleteProfileLeader(leader.id)} aria-label="Hapus sambutan">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Fasilitas & Lingkungan</p>
              <h2>Kelola Fasilitas Sekolah</h2>
            </div>
          </div>

          <form className="admin-post-form" onSubmit={saveSchoolFacility}>
            <div className="admin-form-grid">
              <label>
                <span>Nama Fasilitas</span>
                <input value={facilityForm.name} onChange={(event) => setFacilityForm({ ...facilityForm, name: event.target.value })} required />
              </label>
              <label>
                <span>Icon</span>
                <input value={facilityForm.icon} onChange={(event) => setFacilityForm({ ...facilityForm, icon: event.target.value })} />
              </label>
              <label>
                <span>Urutan</span>
                <input
                  type="number"
                  value={facilityForm.sort_order}
                  onChange={(event) => setFacilityForm({ ...facilityForm, sort_order: Number(event.target.value) })}
                />
              </label>
            </div>
            <label>
              <span>Deskripsi</span>
              <textarea rows="3" value={facilityForm.description} onChange={(event) => setFacilityForm({ ...facilityForm, description: event.target.value })} />
            </label>
            <div className="admin-form-grid">
              <label>
                <span>Gambar Fasilitas</span>
                <input value={facilityForm.image} onChange={(event) => setFacilityForm({ ...facilityForm, image: event.target.value })} />
              </label>
              <label>
                <span>Upload Gambar</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadFacilityImage(event.target.files[0])} />
              </label>
            </div>
            <div className="admin-form-grid">
              <div className="admin-cover-preview">
                <img src={mediaUrl(facilityForm.image)} alt="Preview fasilitas" />
              </div>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(facilityForm.is_active)}
                  onChange={(event) => setFacilityForm({ ...facilityForm, is_active: event.target.checked ? 1 : 0 })}
                />
                <span>Fasilitas aktif dan tampil di website</span>
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit" disabled={isSavingFacility}>
                {facilityForm.id ? <Save size={18} /> : <Plus size={18} />}
                {isSavingFacility ? "Menyimpan..." : facilityForm.id ? "Simpan Fasilitas" : "Tambah Fasilitas"}
              </button>
              {facilityForm.id && (
                <button type="button" className="admin-secondary-button" onClick={() => setFacilityForm(emptyFacilityForm)}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table admin-post-table">
              <thead>
                <tr>
                  <th>Fasilitas</th>
                  <th>Icon</th>
                  <th>Urutan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((facility) => (
                  <tr key={facility.id}>
                    <td>
                      <strong>{facility.name}</strong>
                      <span>{facility.description || "-"}</span>
                    </td>
                    <td>{facility.icon}</td>
                    <td>{facility.sort_order}</td>
                    <td>
                      <span className={`admin-status ${Number(facility.is_active) ? "published" : ""}`}>
                        {Number(facility.is_active) ? "aktif" : "nonaktif"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" onClick={() => editFacility(facility)} aria-label="Edit fasilitas">
                          <Edit3 size={17} />
                        </button>
                        <button type="button" onClick={() => deleteSchoolFacility(facility.id)} aria-label="Hapus fasilitas">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
