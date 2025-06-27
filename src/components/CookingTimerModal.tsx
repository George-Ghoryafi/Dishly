import React from 'react';
import { Modal } from 'react-native';
import { Recipe } from '../types/Recipe';
import CookingTimerScreen from '../screens/CookingTimerScreen';

interface CookingTimerModalProps {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onComplete: () => void;
  currentStreak?: number;
  todayCompleted?: boolean;
}

const CookingTimerModal: React.FC<CookingTimerModalProps> = ({
  visible,
  recipe,
  onClose,
  onComplete,
  currentStreak,
  todayCompleted,
}) => {
  if (!recipe) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <CookingTimerScreen
        recipe={recipe}
        onBack={onClose}
        onComplete={onComplete}
        currentStreak={currentStreak}
        todayCompleted={todayCompleted}
      />
    </Modal>
  );
};

export default CookingTimerModal; 