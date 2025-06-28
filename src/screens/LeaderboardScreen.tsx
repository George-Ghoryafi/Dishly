import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface LeaderboardUser {
  id: string;
  name: string;
  rank: number;
  avatar?: string;
  discoveries: number;
  photosAnalyzed: number;
  recipesCooked: number;
  favoritesAdded: number;
  joinDate: string;
}

type TimePeriod = 'daily' | 'monthly' | 'allTime';
type MetricType = 'discoveries' | 'photos' | 'recipes' | 'favorites';

interface MetricOption {
  id: MetricType;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

const LeaderboardScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('allTime');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('discoveries');

  const [showInfoModal, setShowInfoModal] = useState(false);

  // Generate mock data for top 51 users
  const generateLeaderboardData = (): LeaderboardUser[] => {
    const names = [
      'Discovery King', 'Photo Explorer', 'Dish Hunter', 'Food Scout', 'Recipe Pioneer',
      'Culinary Master', 'Kitchen Wizard', 'Flavor Seeker', 'Dish Detective', 'Food Artist',
      'Recipe Collector', 'Cooking Genius', 'Taste Tester', 'Meal Creator', 'Food Blogger',
      'Kitchen Hero', 'Dish Specialist', 'Cooking Pro', 'Food Enthusiast', 'Recipe Guru',
      'Culinary Explorer', 'Kitchen Star', 'Food Hunter', 'Dish Lover', 'Cooking Expert',
      'Recipe Master', 'Food Adventurer', 'Kitchen Ninja', 'Dish Creator', 'Cooking Legend',
      'Food Scientist', 'Recipe Wizard', 'Kitchen Artist', 'Dish Photographer', 'Food Critic',
      'Cooking Mentor', 'Recipe Hunter', 'Kitchen Explorer', 'Dish Curator', 'Food Innovator',
      'Cooking Virtuoso', 'Recipe Scholar', 'Kitchen Magician', 'Dish Connoisseur', 'Food Pioneer',
      'Cooking Maestro', 'Recipe Enthusiast', 'Kitchen Champion', 'Dish Specialist', 'Food Genius',
      'Jeff'
    ];

    return names.map((name, index) => {
      const rank = index + 1;
      const baseDiscoveries = Math.max(1, 150 - (rank * 2) - Math.floor(Math.random() * 10));
      const basePhotos = Math.max(1, baseDiscoveries * 1.8 + Math.floor(Math.random() * 20));
      const baseRecipes = Math.max(1, Math.floor(baseDiscoveries * 0.7) + Math.floor(Math.random() * 15));
      const baseFavorites = Math.max(1, Math.floor(baseDiscoveries * 1.2) + Math.floor(Math.random() * 25));
      
      return {
        id: (index + 1).toString(),
        name,
        rank,
        discoveries: baseDiscoveries,
        photosAnalyzed: basePhotos,
        recipesCooked: baseRecipes,
        favoritesAdded: baseFavorites,
        joinDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      };
    });
  };

  const leaderboardData = generateLeaderboardData();

  const metricOptions: MetricOption[] = [
    {
      id: 'discoveries',
      title: 'Discoveries',
      subtitle: 'First to photograph dishes',
      icon: 'telescope',
      color: '#FF6B35'
    },
    {
      id: 'photos',
      title: 'Photos Analyzed',
      subtitle: 'AI dish recognitions',
      icon: 'camera',
      color: '#4ECDC4'
    },
    {
      id: 'recipes',
      title: 'Recipes Cooked',
      subtitle: 'Completed cooking sessions',
      icon: 'restaurant',
      color: '#45B7D1'
    },
    {
      id: 'favorites',
      title: 'Favorites Added',
      subtitle: 'Dishes saved to favorites',
      icon: 'heart',
      color: '#96CEB4'
    }
  ];

  const timePeriods = [
    { id: 'daily' as TimePeriod, label: 'Today' },
    { id: 'monthly' as TimePeriod, label: 'This Month' },
    { id: 'allTime' as TimePeriod, label: 'All Time' }
  ];

  const getMetricValue = (user: LeaderboardUser, metric: MetricType): number => {
    switch (metric) {
      case 'discoveries': return user.discoveries;
      case 'photos': return user.photosAnalyzed;
      case 'recipes': return user.recipesCooked;
      case 'favorites': return user.favoritesAdded;
      default: return 0;
    }
  };

  const getMetricLabel = (metric: MetricType): string => {
    switch (metric) {
      case 'discoveries': return 'discoveries';
      case 'photos': return 'photos analyzed';
      case 'recipes': return 'recipes cooked';
      case 'favorites': return 'favorites added';
      default: return '';
    }
  };

  const currentUser: LeaderboardUser = {
    id: 'current',
    name: 'You',
    rank: 23,
    discoveries: 42,
    photosAnalyzed: 78,
    recipesCooked: 45,
    favoritesAdded: 67,
    joinDate: '2024-03-15'
  };

  // Sort leaderboard data based on selected metric
  const sortedLeaderboardData = [...leaderboardData].sort((a, b) => {
    const aValue = getMetricValue(a, selectedMetric);
    const bValue = getMetricValue(b, selectedMetric);
    return bValue - aValue; // Sort in descending order
  }).map((user, index) => ({
    ...user,
    rank: index + 1 // Update rank based on selected metric
  }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Ionicons name="trophy" size={24} color="#FFD700" />;
      case 2:
        return <Ionicons name="medal" size={24} color="#C0C0C0" />;
      case 3:
        return <Ionicons name="medal" size={24} color="#CD7F32" />;
      default:
        return <Text style={styles.rankNumber}>#{rank}</Text>;
    }
  };

  const getDiscoveryBadge = (discoveries: number) => {
    if (discoveries >= 100) return { text: 'Explorer', color: '#FF6B35' };
    if (discoveries >= 50) return { text: 'Pioneer', color: '#4ECDC4' };
    if (discoveries >= 25) return { text: 'Scout', color: '#45B7D1' };
    if (discoveries >= 10) return { text: 'Seeker', color: '#96CEB4' };
    return { text: 'Novice', color: '#BDC3C7' };
  };

  const getMetricColor = (metric: MetricType): string => {
    const metricOption = metricOptions.find(m => m.id === metric);
    return metricOption?.color || '#007AFF';
  };

  const getMetricIcon = (metric: MetricType): string => {
    const metricOption = metricOptions.find(m => m.id === metric);
    return metricOption?.icon || 'star';
  };

  const renderLeaderboardItem = (user: LeaderboardUser, isCurrentUser = false) => {
    const metricValue = getMetricValue(user, selectedMetric);
    const metricLabel = getMetricLabel(selectedMetric);
    const badge = getDiscoveryBadge(user.discoveries);
    const metricColor = getMetricColor(selectedMetric);
    const metricIcon = getMetricIcon(selectedMetric);
    
    return (
      <View key={user.id} style={[
        styles.leaderboardItem, 
        isCurrentUser && styles.currentUserItem,
        { borderLeftColor: metricColor, borderLeftWidth: 4 }
      ]}>
        <View style={styles.rankContainer}>
          {getRankIcon(user.rank)}
        </View>
        
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons name="person" size={20} color="#666" />
            </View>
          )}
          {selectedMetric === 'discoveries' && (
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
            {user.name}
          </Text>
          <View style={styles.primaryMetricContainer}>
            <Ionicons name={metricIcon as any} size={14} color={metricColor} />
            <Text style={[styles.primaryMetric, { color: metricColor }]}>
              {metricValue.toLocaleString()} {metricLabel}
            </Text>
          </View>
          <Text style={styles.secondaryStats}>
            {[
              selectedMetric !== 'discoveries' && `${user.discoveries} discoveries`,
              selectedMetric !== 'photos' && `${user.photosAnalyzed} photos`,
              selectedMetric !== 'recipes' && `${user.recipesCooked} recipes`,
              selectedMetric !== 'favorites' && `${user.favoritesAdded} favorites`
            ].filter(Boolean).join(' • ')}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <View style={[styles.metricBadge, { backgroundColor: `${metricColor}15`, borderColor: metricColor }]}>
            <Text style={[styles.metricBadgeText, { color: metricColor }]}>
              #{user.rank}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderInfoModal = () => (
    <Modal
      visible={showInfoModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowInfoModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>How to Climb the Leaderboard</Text>
            <TouchableOpacity onPress={() => setShowInfoModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.infoItem}>
              <Ionicons name="telescope" size={20} color="#FF6B35" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoItemTitle}>Make Discoveries</Text>
                <Text style={styles.infoItemText}>Be the first to photograph unique dishes and earn discovery points</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="camera" size={20} color="#4ECDC4" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoItemTitle}>Analyze Photos</Text>
                <Text style={styles.infoItemText}>Use AI to identify dishes and build your photo analysis count</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="restaurant" size={20} color="#45B7D1" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoItemTitle}>Cook Recipes</Text>
                <Text style={styles.infoItemText}>Complete cooking sessions and track your culinary progress</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="heart" size={20} color="#96CEB4" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoItemTitle}>Save Favorites</Text>
                <Text style={styles.infoItemText}>Build your personal collection and discover new dishes</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <TouchableOpacity onPress={() => setShowInfoModal(true)}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {timePeriods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metric Selector */}
        <View style={styles.metricSelector}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metricScrollContent}
          >
            {metricOptions.map((metric, index) => (
              <TouchableOpacity
                key={metric.id}
                style={[
                  styles.metricCard,
                  selectedMetric === metric.id && [
                    styles.metricCardActive,
                    { 
                      borderColor: metric.color,
                      backgroundColor: '#f8f9fa',
                      transform: [{ scale: 1.02 }]
                    }
                  ]
                ]}
                onPress={() => setSelectedMetric(metric.id)}
              >
                <View style={[
                  styles.metricIcon, 
                  { backgroundColor: selectedMetric === metric.id ? metric.color : `${metric.color}15` }
                ]}>
                  <Ionicons 
                    name={metric.icon as any} 
                    size={20} 
                    color={selectedMetric === metric.id ? '#ffffff' : metric.color} 
                  />
                </View>
                <Text style={[
                  styles.metricTitle,
                  selectedMetric === metric.id && { color: '#333', fontWeight: '700' }
                ]}>
                  {metric.title}
                </Text>
                <Text style={[
                  styles.metricSubtitle,
                  selectedMetric === metric.id && { color: '#666', fontWeight: '500' }
                ]}>
                  {metric.subtitle}
                </Text>
                {selectedMetric === metric.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: metric.color }]} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>



        {/* Current User Section */}
        <View style={styles.currentUserSection}>
          <Text style={styles.sectionTitle}>Your Ranking</Text>
          {renderLeaderboardItem(currentUser, true)}
        </View>

        {/* Top Players Section */}
        <View style={styles.topPlayersSection}>
          <Text style={styles.sectionTitle}>
            Top 51 by {metricOptions.find(m => m.id === selectedMetric)?.title}
          </Text>
          {sortedLeaderboardData.map((user) => renderLeaderboardItem(user))}
        </View>
      </ScrollView>

      {/* Info Modal */}
      {renderInfoModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: Math.min(24, screenWidth * 0.06),
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: Math.max(12, Math.min(14, screenWidth * 0.035)),
    fontWeight: '600',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  metricSelector: {
    marginBottom: 20,
    marginHorizontal: -20, // Extend to edges by negating container padding
  },
  metricScrollContent: {
    paddingHorizontal: 20, // Add padding to scroll content instead
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: Math.max(12, screenWidth * 0.04),
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    width: Math.max(120, screenWidth * 0.35),
    minHeight: Math.max(100, screenWidth * 0.28),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricCardActive: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: Math.max(12, Math.min(14, screenWidth * 0.035)),
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  metricSubtitle: {
    fontSize: Math.max(10, Math.min(12, screenWidth * 0.03)),
    color: '#666',
    lineHeight: Math.max(14, screenWidth * 0.04),
  },
  currentUserSection: {
    marginBottom: 30,
  },
  topPlayersSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: Math.max(16, Math.min(18, screenWidth * 0.045)),
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },

  primaryMetricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  primaryMetric: {
    fontSize: Math.max(12, Math.min(14, screenWidth * 0.035)),
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryStats: {
    fontSize: Math.max(10, Math.min(12, screenWidth * 0.03)),
    color: '#666',
  },
  metricBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  metricBadgeText: {
    fontSize: Math.max(12, Math.min(14, screenWidth * 0.035)),
    fontWeight: '700',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserItem: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  avatarContainer: {
    marginLeft: 8,
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 18,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Math.max(14, Math.min(16, screenWidth * 0.04)),
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  currentUserName: {
    color: '#007AFF',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoItemText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default LeaderboardScreen; 