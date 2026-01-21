"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../lib/context/auth-context";
import Card, { CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from "../../components/ui/Card";

export default function AdminPage() {
	const router = useRouter();
	// use csrfToken from AuthProvider
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const { csrfToken: authCsrf, isLoading: authLoading, apiCall } = useAuth();

	// Mock data untuk social media cards (bisa dari API/database)
	const socialMediaAccounts = [
		{
			id: 1,
			platform: "Instagram",
			handle: "@catid.hysteria",
			icon: (
				<svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
				</svg>
			),
			followers: "12.5K",
			bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
			textColor: "text-white"
		},
		{
			id: 2,
			platform: "Facebook",
			handle: "Catid.Hysteria",
			icon: (
				<svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
				</svg>
			),
			followers: "8.2K",
			bgColor: "bg-blue-600",
			textColor: "text-white"
		},
		{
			id: 3,
			platform: "Twitter/X",
			handle: "@globalcatidHysteria",
			icon: (
				<svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
				</svg>
			),
			followers: "15.8K",
			bgColor: "bg-black",
			textColor: "text-white"
		},
		{
			id: 4,
			platform: "LinkedIn",
			handle: "Catid Hysteria",
			icon: (
				<svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
				</svg>
			),
			followers: "5.4K",
			bgColor: "bg-blue-700",
			textColor: "text-white"
		},
		{
			id: 5,
			platform: "YouTube",
			handle: "Catid Hysteria",
			icon: (
				<svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
				</svg>
			),
			followers: "23.1K",
			bgColor: "bg-red-600",
			textColor: "text-white"
		},
		{
			id: 6,
			platform: "TikTok",
			handle: "@catid.hysteria",
			icon: (
				<svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
				</svg>
			),
			followers: "45.6K",
			bgColor: "bg-black",
			textColor: "text-white"
		}
	];

	useEffect(() => {
		if (authCsrf) {
			const t = setTimeout(() => {
				setToastMessage("Selamat datang di area admin.");
				setToastVisible(true);
			}, 0);
			return () => clearTimeout(t);
		}
	}, [authCsrf]);

	const handleLogout = async () => {
		if (!authCsrf) return;
		setLoading(true);
		await apiCall('/api/auth/logout', { method: 'POST' })
		setLoading(false);
		router.push("/auth/login");
	};

	return (
		<>
			<div className="space-y-6">
				{/* Header dengan Logout */}
				<Card
					title="Dashboard Admin"
					variant="elevated"
					actions={
						<button
							onClick={handleLogout}
							disabled={loading || !authCsrf}
							className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? "Keluar..." : "Keluar"}
						</button>
					}
				>
					<p className="text-zinc-600">Selamat datang di area admin. Kelola sistem Anda dengan mudah.</p>
				</Card>

				{/* Grid 3 Kolom - Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card variant="default" hoverable>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-zinc-500">Total Users</p>
								<p className="text-3xl font-bold text-zinc-900 mt-2">1,234</p>
								<p className="text-xs text-green-600 mt-1">+12% dari bulan lalu</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
								<svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
							</div>
						</div>
					</Card>

					<Card variant="default" hoverable>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-zinc-500">Active Sessions</p>
								<p className="text-3xl font-bold text-zinc-900 mt-2">89</p>
								<p className="text-xs text-green-600 mt-1">+5% dari kemarin</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
								<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
						</div>
					</Card>

					<Card variant="default" hoverable>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-zinc-500">Total Roles</p>
								<p className="text-3xl font-bold text-zinc-900 mt-2">12</p>
								<p className="text-xs text-zinc-500 mt-1">3 active permissions</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
								<svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
						</div>
					</Card>
				</div>

				{/* Grid 2 Kolom - Different Variants */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card
						title="Recent Activity"
						variant="outlined"
						footer={
							<button className="text-sm font-medium text-blue-600 hover:text-blue-700">
								Lihat Semua →
							</button>
						}
					>
						<div className="space-y-3">
							<div className="flex items-start gap-3 pb-3 border-b border-zinc-100">
								<div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
								<div className="flex-1">
									<p className="text-sm font-medium text-zinc-900">User baru terdaftar</p>
									<p className="text-xs text-zinc-500">2 menit yang lalu</p>
								</div>
							</div>
							<div className="flex items-start gap-3 pb-3 border-b border-zinc-100">
								<div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
								<div className="flex-1">
									<p className="text-sm font-medium text-zinc-900">Role diperbarui</p>
									<p className="text-xs text-zinc-500">15 menit yang lalu</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="h-2 w-2 rounded-full bg-yellow-500 mt-2"></div>
								<div className="flex-1">
									<p className="text-sm font-medium text-zinc-900">Permission ditambahkan</p>
									<p className="text-xs text-zinc-500">1 jam yang lalu</p>
								</div>
							</div>
						</div>
					</Card>

					<Card variant="filled">
						<CardHeader>
							<CardTitle>System Status</CardTitle>
							<CardDescription>Semua sistem berjalan normal</CardDescription>
						</CardHeader>
						<CardBody className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-700">Database</span>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									Online
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-700">API Server</span>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									Online
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-700">Cache</span>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									Online
								</span>
							</div>
						</CardBody>
					</Card>
				</div>

				{/* Card Clickable */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card hoverable onClick={() => alert('User Management clicked!')} className="text-center">
						<div className="flex flex-col items-center">
							<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
								<svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
							</div>
							<h3 className="font-semibold text-zinc-900">Users</h3>
							<p className="text-xs text-zinc-500 mt-1">Kelola pengguna</p>
						</div>
					</Card>

					<Card hoverable onClick={() => alert('Roles clicked!')} className="text-center">
						<div className="flex flex-col items-center">
							<div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
								<svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							</div>
							<h3 className="font-semibold text-zinc-900">Roles</h3>
							<p className="text-xs text-zinc-500 mt-1">Atur peran</p>
						</div>
					</Card>

					<Card hoverable onClick={() => alert('Settings clicked!')} className="text-center">
						<div className="flex flex-col items-center">
							<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
								<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<h3 className="font-semibold text-zinc-900">Settings</h3>
							<p className="text-xs text-zinc-500 mt-1">Konfigurasi</p>
						</div>
					</Card>

					<Card hoverable onClick={() => alert('Reports clicked!')} className="text-center">
						<div className="flex flex-col items-center">
							<div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
								<svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 className="font-semibold text-zinc-900">Reports</h3>
							<p className="text-xs text-zinc-500 mt-1">Lihat laporan</p>
						</div>
					</Card>
				</div>

				{/* Social Media Cards - DINAMIS dengan Mock Data */}
				<div>
					<h2 className="text-xl font-semibold text-zinc-900 mb-4">Social Media Accounts (Data Dinamis)</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{socialMediaAccounts.map((account) => (
							<Card
								key={account.id}
								hoverable
								onClick={() => alert(`Membuka ${account.platform}: ${account.handle}`)}
								className="overflow-hidden"
							>
								<div className={`${account.bgColor} ${account.textColor} p-6 -m-6 mb-4`}>
									<div className="flex items-center gap-3">
										{account.icon}
										<div>
											<h3 className="font-bold text-lg">{account.platform}</h3>
											<p className="text-sm opacity-90">{account.handle}</p>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between mt-2">
									<span className="text-sm text-zinc-600">Followers</span>
									<span className="text-xl font-bold text-zinc-900">{account.followers}</span>
								</div>
							</Card>
						))}
					</div>
				</div>

				{/* Contoh lain: Product Cards dengan data dinamis */}
				<div>
					<h2 className="text-xl font-semibold text-zinc-900 mb-4">Products (Data Dinamis)</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{[
							{ id: 1, name: "Laptop Gaming", price: "Rp 15.000.000", stock: 12, status: "available" },
							{ id: 2, name: "Mechanical Keyboard", price: "Rp 850.000", stock: 5, status: "low" },
							{ id: 3, name: "Gaming Mouse", price: "Rp 450.000", stock: 0, status: "out" },
							{ id: 4, name: "Monitor 4K", price: "Rp 5.500.000", stock: 8, status: "available" },
						].map((product) => (
							<Card key={product.id} variant="outlined" hoverable>
								<div className="space-y-3">
									<div className="h-32 bg-zinc-100 rounded-lg flex items-center justify-center">
										<svg className="h-16 w-16 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
										</svg>
									</div>
									<div>
										<h3 className="font-semibold text-zinc-900">{product.name}</h3>
										<p className="text-lg font-bold text-blue-600 mt-1">{product.price}</p>
									</div>
									<div className="flex items-center justify-between pt-2 border-t border-zinc-200">
										<span className="text-xs text-zinc-500">Stock: {product.stock}</span>
										<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
											product.status === 'available' ? 'bg-green-100 text-green-800' :
											product.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
											'bg-red-100 text-red-800'
										}`}>
											{product.status === 'available' ? 'Available' :
											 product.status === 'low' ? 'Low Stock' : 'Out of Stock'}
										</span>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>

				{/* Team Members dengan data dinamis */}
				<div>
					<h2 className="text-xl font-semibold text-zinc-900 mb-4">Team Members (Data Dinamis)</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{[
							{ id: 1, name: "Budi Santoso", role: "Frontend Developer", avatar: "BS", color: "bg-blue-500" },
							{ id: 2, name: "Siti Nurhaliza", role: "Backend Developer", avatar: "SN", color: "bg-purple-500" },
							{ id: 3, name: "Ahmad Rizki", role: "UI/UX Designer", avatar: "AR", color: "bg-green-500" },
							{ id: 4, name: "Maya Sari", role: "Project Manager", avatar: "MS", color: "bg-pink-500" },
						].map((member) => (
							<Card key={member.id} variant="default" hoverable className="text-center">
								<div className="flex flex-col items-center">
									<div className={`h-16 w-16 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-xl mb-3`}>
										{member.avatar}
									</div>
									<h3 className="font-semibold text-zinc-900">{member.name}</h3>
									<p className="text-sm text-zinc-500 mt-1">{member.role}</p>
									<button className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium">
										View Profile →
									</button>
								</div>
							</Card>
						))}
					</div>
				</div>

				{/* Loading Card Demo */}
				<Card title="Loading Example" loading={false} />
			</div>
			{/* <Toast message={toastMessage} type="info" visible={toastVisible} onClose={() => setToastVisible(false)} /> */}
		</>
	);
}
