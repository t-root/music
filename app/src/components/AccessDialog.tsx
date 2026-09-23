// Popup nhập token lần đầu mở app — thay cho #accessDialog ("Bạn là Trung?")
// bản gốc. Bỏ bước hỏi Yes/No (không cần thiết vì token là thứ cấp quyền thật,
// không phải lớp ngụy trang như mật khẩu md5 cứng của bản web). Chỉ hiện một
// lần: SecureStore lưu token tới khi gỡ app hoặc xóa token trong Cài đặt.
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '@/ui/Text';
import { useStore } from '@/state/store';
import { colors, fonts, spacing } from '@/theme';

export function AccessDialog() {
  const visible = useStore((s) => s.showAccessPrompt);
  const dismiss = useStore((s) => s.dismissAccessPrompt);
  const setToken = useStore((s) => s.setToken);
  const [tokenInput, setTokenInput] = useState('');

  const close = () => {
    setTokenInput('');
    dismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>PRIVATE SESSION</Text>
          <Text style={styles.title}>Nhập GitHub token</Text>
          <Text style={styles.label}>Dán token để mở quyền chỉnh sửa (thêm/xóa bài, playlist...).</Text>
          <TextInput
            style={styles.input}
            value={tokenInput}
            onChangeText={setTokenInput}
            placeholder="github_pat_..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            secureTextEntry
            autoFocus
          />
          <Pressable
            style={styles.primaryButtonFull}
            onPress={() => {
              if (!tokenInput.trim()) return;
              setToken(tokenInput.trim());
              close();
            }}
          >
            <Text style={styles.primaryText}>Lưu</Text>
          </Pressable>
          <Pressable style={styles.skip} onPress={close}>
            <Text style={styles.skipText}>Bỏ qua, chỉ nghe</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.78)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { width: '100%', maxWidth: 360, padding: spacing.xl, borderWidth: 1, borderColor: colors.accent, backgroundColor: '#0b1014' },
  eyebrow: { color: colors.accent, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: spacing.sm },
  title: { color: colors.text, fontFamily: fonts.headingBold, fontSize: 20, textTransform: 'uppercase', marginBottom: spacing.sm },
  label: { color: colors.textMuted, fontSize: 11, marginBottom: spacing.md, lineHeight: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontFamily: fonts.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  primaryButtonFull: { height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.accent },
  primaryText: { color: colors.accent, fontWeight: '700' },
  skip: { marginTop: spacing.md, alignItems: 'center' },
  skipText: { color: colors.textMuted, fontSize: 12 },
});
