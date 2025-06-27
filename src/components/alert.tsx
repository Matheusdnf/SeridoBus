import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  showCancel = false,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 bg-white rounded-xl p-6">
          <Text className="text-lg font-bold mb-2 text-black">{title}</Text>
          <Text className="text-black mb-4">{message}</Text>

          <View className="flex-row justify-end space-x-4">
            {showCancel && (
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-300 rounded-lg px-4 py-2"
              >
                <Text className="font-bold text-black">Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                onClose();
                if (onConfirm) onConfirm();
              }}
              className="bg-yellow-400 rounded-lg px-4 py-2"
            >
              <Text className="font-bold text-black">
                {showCancel ? "Confirmar" : "Fechar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
