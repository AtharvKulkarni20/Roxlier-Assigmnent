import AverageRating from "./AverageRating"
import RatingsTable from "./RatingsTable"
import {Link} from "react-router-dom"
import {Store, TrendingUp, Users, Calendar, ExternalLink} from "lucide-react"
import {useEffect, useState} from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function OwnerDashboardPage() {
    const [data, setData] = useState([{
        store: {
            id: 0,
            name: "",
        },
        avgRating: {
            avg_rating: null,
            total_rating: 0,
        },
        ratingUsers: 0
    }])

    useEffect(() => {
        async function loadData() {
            const res = await axios.get('http://localhost:5000/api/store/dashboard', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            setData(res.data)
        }
        loadData()
    }, [])

    const renderDashboard = (storeData) => (
        <div className="space-y-8">
            {/* Hero Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-black/20 overflow-hidden">
                <div className="px-8 py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="backdrop-blur-sm rounded-xl p-3">
                            <Store className="h-8 w-8"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-black mb-2">Store Owner Dashboard</h1>
                            <p className="font-semibold text-lg">
                                Managing <span className="font-semibold text-black">{storeData.store.name}</span>
                            </p>
                        </div>
                    </div>
                    <Link
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-black px-4 py-2 rounded-lg transition-colors border border-white/20"
                        to="/stores"
                    >
                        <ExternalLink className="h-4 w-4"/>
                        View Store Listings
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AverageRating 
                    storeName={storeData.store.name} 
                    average={storeData.avgRating.avg_rating} 
                    count={storeData.avgRating.total_rating}
                    className="border-black/20"
                />

                {/* Quick Stats Cards */}
                <div className="bg-white rounded-xl shadow-lg border border-black/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-100 rounded-lg p-2">
                            <TrendingUp className="h-5 w-5 text-green-600"/>
                        </div>
                        <h3 className="font-semibold text-slate-900">Growth</h3>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{storeData.avgRating?.total_rating}</div>
                    <p className="text-sm text-slate-600">Total Ratings</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-black/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 rounded-lg p-2">
                            <Users className="h-5 w-5 text-blue-600"/>
                        </div>
                        <h3 className="font-semibold text-slate-900">Customers</h3>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{storeData.ratingUsers?.length || 0}</div>
                    <p className="text-sm text-slate-600">Unique Reviewers</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-black/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-purple-100 rounded-lg p-2">
                            <Calendar className="h-5 w-5 text-purple-600"/>
                        </div>
                        <h3 className="font-semibold text-slate-900">Latest</h3>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                        {storeData?.ratingUsers[0]?.date?.split('-')[2] || "--"}
                    </div>
                    <p className="text-sm text-slate-600">
                        {storeData?.ratingUsers[0]?.date ? new Date(storeData?.ratingUsers[0].date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        }) : "No ratings yet"}
                    </p>
                </div>
            </section>

            {/* Ratings Section */}
            <section className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r border border-black/20 rounded-2xl bg-slate-100 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
                            <p className="">Feedback from your valued customers</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-black">
                            <span className="font-semibold">{storeData?.ratingUsers.length || 0} Reviews</span>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <RatingsTable ratings={storeData?.ratingUsers}/>
                </div>
            </section>
        </div>
    )

    return (
        <div className="min-h-screen">
            <main className="container mx-auto max-w-7xl px-4 py-8">
                {data.length > 1 ? (
                    <Tabs defaultValue="0" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            {data.map((item, index) => (
                                <TabsTrigger key={item.store.id} value={index.toString()}>
                                    <Store className="h-4 w-4 mr-2" />
                                    {item.store.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {data.map((item, index) => (
                            <TabsContent key={item.store.id} value={index.toString()}>
                                {renderDashboard(item)}
                            </TabsContent>
                        ))}
                    </Tabs>
                ) : (
                    renderDashboard(data[0] || {
                        store: { id: 0, name: "" },
                        avgRating: { avg_rating: null, total_rating: 0 },
                        ratingUsers: []
                    })
                )}
            </main>
        </div>
    )
}