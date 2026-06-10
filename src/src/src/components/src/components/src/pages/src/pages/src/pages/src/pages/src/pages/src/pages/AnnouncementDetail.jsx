import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import BottomNav from '../components/BottomNav'
import { ArrowLeft, MapPin, Package, Calendar, Star, Send, CheckCircle, Truck, Phone } from 'lucide-react'

export default function AnnouncementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [ann, setAnn] = useState(null)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [myOffer, setMyOffer] = useState(null)
  const [offerForm, setOfferForm] = useState({ price: '', transit_min: '', transit_max: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [showRating, setShowRating] = useState(false)
  const [ratingScore, setRatingScore] = useState(0)
  const [ratingComment, setRatingComment] = useState('')

  useEffect(() => { fetchAll() }, [id])

  async function fetchAll() {
    setLoading(true)
    const [{ data: annData }, { data: offersData }] = await Promise.all([
      supabase.from('announcements').select('*, profiles(full_name, phone, rating_avg, rating_count)').eq('id', id).single(),
      supabase.from('offers').select('*, profiles(full_name, rating_avg, rating_count, carriers(kyc_status, vehicle_type))').eq('announcement_id', id).order('created_at', { ascending: false }),
    ])
    setAnn(annData)
    setOffers(offersData || [])
    if (profile?.role === 'carrier') setMyOffer(offersData?.find(o => o.carrier_id === user.id) || null)
    setLoading(false)
  }

  async function submitOffer(e) {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('offers').insert({ announcement_id: id, carrier_id: user.id, price_offered: parseFloat(offerForm.price), currency: 'EUR', transit_days_min: parseInt(offerForm.transit_min), transit_days_max: parseInt(offerForm.transit_max), message: offerForm.message, status: 'pending' })
    if (!error) { showToastMsg('Offre envoyee !', 'success'); fetchAll() }
    else showToastMsg('Erreur lors de l\'envoi', 'error')
    setSubmitting(false)
  }

  async function acceptOffer(offerId) {
    await supabase.from('offers').update({ status: 'accepted' }).eq('id', offerId)
    await supabase.from('offers').update({ status: 'rejected' }).eq('announcement_id', id).neq('id', offerId)
    await supabase.from('announcements').update({ status: 'confirmed' }).eq('id', id)
    showToastMsg('Offre acceptee !', 'success')
    fetchAll()
  }

  async function submitRating(targetId) {
    await supabase.from('reviews').insert({ announcement_id: id, reviewer_id: user.id, reviewed_id: targetId, score: ratingScore, comment: ratingComment })
    showToastMsg('Note envoyee !', 'success')
    setShowRating(false)
  }

  function showToastMsg(msg, type =
