import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar?: string;
  recipesCooked: number;
}

const LeaderboardScreen: React.FC = () => {
  // Mock data for demonstration
  const leaderboardData: LeaderboardUser[] = [
    { id: '1', name: 'Chef Master', score: 2450, rank: 1, recipesCooked: 89 },
    { id: '2', name: 'Kitchen Pro', score: 2200, rank: 2, recipesCooked: 76 },
    { id: '3', name: 'Cooking Star', score: 1980, rank: 3, recipesCooked: 65 },
    { id: '4', name: 'Food Lover', score: 1750, rank: 4, recipesCooked: 58 },
    { id: '5', name: 'Recipe Hunter', score: 1520, rank: 5, recipesCooked: 52 },
  ];

  const currentUser: LeaderboardUser = {
    id: 'current',
    name: 'You',
    score: 1350,
    rank: 8,
    recipesCooked: 45,
  };

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

  const renderLeaderboardItem = (user: LeaderboardUser, isCurrentUser = false) => (
    <View key={user.id} style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
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
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
          {user.name}
        </Text>
        <Text style={styles.recipesCount}>{user.recipesCooked} recipes cooked</Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, isCurrentUser && styles.currentUserScore]}>
          {user.score.toLocaleString()}
        </Text>
        <Text style={styles.scoreLabel}>points</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Ionicons name="trophy-outline" size={24} color="#007AFF" />
      </View>

      <ScrollView style={styles.content}>
        {/* Current User Section */}
        <View style={styles.currentUserSection}>
          <Text style={styles.sectionTitle}>Your Ranking</Text>
          {renderLeaderboardItem(currentUser, true)}
        </View>

        {/* Top Players Section */}
        <View style={styles.topPlayersSection}>
          <Text style={styles.sectionTitle}>Top Chefs</Text>
          {leaderboardData.map((user) => renderLeaderboardItem(user))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How to earn points:</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Complete a recipe: +50 points</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.infoText}>Rate a recipe: +10 points</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="heart" size={16} color="#FF6B6B" />
            <Text style={styles.infoText}>Save to favorites: +5 points</Text>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentUserSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  topPlayersSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
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
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  avatarContainer: {
    marginLeft: 10,
    marginRight: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  currentUserName: {
    color: '#007AFF',
  },
  recipesCount: {
    fontSize: 12,
    color: '#666',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currentUserScore: {
    color: '#007AFF',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
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
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

export default LeaderboardScreen; 