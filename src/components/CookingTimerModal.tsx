import React from 'react';
import { Modal } from 'react-native';
import { Recipe } from '../types/Recipe';
import CookingTimerScreen from '../screens/CookingTimerScreen';

interface CookingTimerModalProps {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onComplete: () => void;
}

const CookingTimerModal: React.FC<CookingTimerModalProps> = ({
  visible,
  recipe,
  onClose,
  onComplete,
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
      />
    </Modal>
  );
};

export default CookingTimerModal; 