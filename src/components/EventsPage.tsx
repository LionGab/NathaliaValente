/**
 * EventsPage - Community events and calendar with premium design
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Sparkles,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUpcomingEvents, registerForEvent, unregisterFromEvent, isUserRegistered } from '../services/events.service';
import type { Event } from '../types/events';
import { Button } from './ui/Button';

const CATEGORY_COLORS = {
  workshop: 'from-pink-500 to-rose-600',
  live: 'from-purple-500 to-indigo-600',
  meetup: 'from-blue-500 to-cyan-600',
  webinar: 'from-green-500 to-emerald-600',
  masterclass: 'from-orange-500 to-amber-600',
};

const CATEGORY_LABELS = {
  workshop: 'Workshop',
  live: 'Live',
  meetup: 'Encontro',
  webinar: 'Webinar',
  masterclass: 'Masterclass',
};

export const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const { data } = await getUpcomingEvents(20);
    setEvents(data);

    // Check which events user is registered for
    if (user) {
      const registrations = new Set<string>();
      for (const event of data) {
        const isRegistered = await isUserRegistered(event.id, user.id);
        if (isRegistered) {
          registrations.add(event.id);
        }
      }
      setRegisteredEvents(registrations);
    }

    setLoading(false);
  };

  const handleRegister = async (eventId: string) => {
    if (!user) return;

    const { success, error } = await registerForEvent(eventId, user.id);
    if (success) {
      setRegisteredEvents((prev) => new Set(prev).add(eventId));
      loadEvents(); // Reload to update attendee count
    } else {
      alert(error as string);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;

    const { success } = await unregisterFromEvent(eventId, user.id);
    if (success) {
      setRegisteredEvents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      loadEvents();
    }
  };

  // Calendar functionality
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          <p className="text-sm text-claude-gray-500 dark:text-claude-gray-400">
            Carregando eventos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
      {/* Header Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-8 mb-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wider">Eventos da Comunidade</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Conecte-se e Aprenda
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Participe de eventos exclusivos, workshops e lives com a Nath e outras mães incríveis
          </p>
        </div>
      </motion.div>

      {/* Mini Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-claude-gray-800 rounded-3xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-claude-gray-900 dark:text-white">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 rounded-xl hover:bg-claude-gray-100 dark:hover:bg-claude-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-claude-gray-100 dark:hover:bg-claude-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-claude-gray-600 dark:text-claude-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;

            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  hasEvents
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-claude-gray-100 dark:bg-claude-gray-700 text-claude-gray-700 dark:text-claude-gray-300 hover:bg-claude-gray-200 dark:hover:bg-claude-gray-600'
                }`}
              >
                <span className="text-sm font-semibold">{day}</span>
                {hasEvents && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((_, idx) => (
                      <div key={idx} className="w-1 h-1 bg-white rounded-full" />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Events List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-claude-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-500" />
          Próximos Eventos
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event, index) => {
            const isRegistered = registeredEvents.has(event.id);
            const isFull = event.max_attendees && event.current_attendees >= event.max_attendees;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-white dark:bg-claude-gray-800 rounded-3xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                {event.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${CATEGORY_COLORS[event.category]} px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg`}>
                      {CATEGORY_LABELS[event.category]}
                    </div>
                    {event.is_premium && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-claude-gray-900 dark:text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-claude-gray-600 dark:text-claude-gray-400">
                      <Clock className="w-4 h-4" />
                      {new Date(event.start_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-claude-gray-600 dark:text-claude-gray-400">
                      {event.is_online ? (
                        <>
                          <Video className="w-4 h-4" />
                          Online
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          {event.location || 'A definir'}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-claude-gray-600 dark:text-claude-gray-400">
                      <Users className="w-4 h-4" />
                      {event.current_attendees} inscritas
                      {event.max_attendees && ` / ${event.max_attendees}`}
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isRegistered) {
                        handleUnregister(event.id);
                      } else {
                        handleRegister(event.id);
                      }
                    }}
                    disabled={!isRegistered && !!isFull}
                    className={`w-full ${
                      isRegistered
                        ? 'bg-green-600 hover:bg-green-700'
                        : isFull
                        ? 'bg-claude-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                    }`}
                    leftIcon={
                      isRegistered ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />
                    }
                  >
                    {isRegistered ? 'Inscrita' : isFull ? 'Esgotado' : 'Inscrever-se'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-claude-gray-400 mx-auto mb-4" />
            <p className="text-lg text-claude-gray-600 dark:text-claude-gray-400">
              Nenhum evento programado no momento
            </p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-claude-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedEvent.image_url && (
                <div className="relative h-64">
                  <img
                    src={selectedEvent.image_url}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-claude-gray-800/90 rounded-full hover:bg-white dark:hover:bg-claude-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`inline-block bg-gradient-to-r ${CATEGORY_COLORS[selectedEvent.category]} px-3 py-1 rounded-full text-xs font-semibold text-white mb-3`}>
                      {CATEGORY_LABELS[selectedEvent.category]}
                    </div>
                    <h2 className="text-3xl font-bold text-claude-gray-900 dark:text-white">
                      {selectedEvent.title}
                    </h2>
                  </div>
                </div>

                <p className="text-claude-gray-700 dark:text-claude-gray-300 mb-6 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="space-y-3 mb-6 bg-claude-gray-50 dark:bg-claude-gray-900 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-pink-500" />
                    <div>
                      <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400">Início</p>
                      <p className="font-semibold text-claude-gray-900 dark:text-white">
                        {new Date(selectedEvent.start_date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedEvent.is_online ? (
                      <>
                        <Video className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400">Formato</p>
                          <p className="font-semibold text-claude-gray-900 dark:text-white">Evento Online</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400">Local</p>
                          <p className="font-semibold text-claude-gray-900 dark:text-white">
                            {selectedEvent.location || 'A definir'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400">Participantes</p>
                      <p className="font-semibold text-claude-gray-900 dark:text-white">
                        {selectedEvent.current_attendees} inscritas
                        {selectedEvent.max_attendees && ` de ${selectedEvent.max_attendees}`}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    const isRegistered = registeredEvents.has(selectedEvent.id);
                    if (isRegistered) {
                      handleUnregister(selectedEvent.id);
                    } else {
                      handleRegister(selectedEvent.id);
                    }
                    setSelectedEvent(null);
                  }}
                  disabled={
                    !registeredEvents.has(selectedEvent.id) &&
                    !!selectedEvent.max_attendees &&
                    selectedEvent.current_attendees >= selectedEvent.max_attendees
                  }
                  className="w-full py-4 text-lg"
                  leftIcon={
                    registeredEvents.has(selectedEvent.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )
                  }
                >
                  {registeredEvents.has(selectedEvent.id)
                    ? 'Inscrita'
                    : selectedEvent.max_attendees &&
                      selectedEvent.current_attendees >= selectedEvent.max_attendees
                    ? 'Esgotado'
                    : 'Inscrever-se'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
