import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { colors, shadow } from "../theme";

export type IconName = React.ComponentProps<typeof FontAwesome5>["name"];

export function Icon({ name, size = 16, color = "rgb(80,80,80)" }: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <FontAwesome5 name={name} size={size} color={color} solid />;
}

// Icon-only buttons need a `label`, which screen readers announce.
export function Button({ title, label, icon, iconColor, onPress, style, textStyle, disabled }: {
  title?: string;
  label?: string;
  icon?: IconName;
  iconColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? title}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}
    >
      {icon && <Icon name={icon} color={iconColor} />}
      {title && (
        <Text numberOfLines={1} style={[styles.buttonText, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function SearchInput({ value, onChangeText }: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.searchInput}>
      <Icon name="search" color="grey" />
      <TextInput
        style={styles.searchInputText}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        autoCorrect={false}
      />
    </View>
  );
}

export function ProgressCard({ icon, text, color, progress }: {
  icon: IconName;
  text: string;
  color: string;
  progress: number;
}) {
  return (
    <View style={styles.progressCard}>
      <View style={styles.row}>
        <Icon name={icon} size={20} color={color} />
        <Text style={styles.progressText}>{text}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function Banner({ title, subtitle, gradient, titleColor = "white", subtitleColor = "white", profile, actions }: {
  title: string;
  subtitle: string;
  gradient: readonly [string, string];
  titleColor?: string;
  subtitleColor?: string;
  profile?: ImageSourcePropType;
  actions?: { title: string; icon?: IconName; onPress: () => void }[];
}) {
  return (
    <View style={styles.banner}>
      <LinearGradient colors={gradient} style={styles.bannerGradient}>
        <View style={styles.bannerText}>
          <Text style={[styles.bannerTitle, { color: titleColor }]}>{title}</Text>
          <Text style={[styles.bannerSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
        </View>
        {actions ? (
          <View style={styles.bannerActions}>
            {actions.map((a) => (
              <Button key={a.title} title={a.title} icon={a.icon} onPress={a.onPress} style={styles.bannerAction} />
            ))}
          </View>
        ) : (
          profile && <Image source={profile} style={styles.bannerProfile} />
        )}
      </LinearGradient>
    </View>
  );
}

export function EmptyText({ children }: { children: string }) {
  return <Text style={styles.emptyText}>{children}</Text>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 7,
    backgroundColor: "white",
  },
  buttonText: { fontSize: 16, fontWeight: "700", color: colors.brand },

  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: colors.surface,
  },
  searchInputText: { flex: 1, fontSize: 16, padding: 5 },

  progressCard: { flex: 1, gap: 10, padding: 10, borderRadius: 10, backgroundColor: "#ebebeb" },
  progressText: { fontWeight: "600", color: colors.text },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden", backgroundColor: "white" },
  progressFill: { height: "100%" },

  banner: { ...shadow, height: 120, borderRadius: 10, overflow: "hidden", backgroundColor: "white" },
  bannerGradient: { flex: 1, flexDirection: "row", padding: 15 },
  bannerText: { flex: 2 },
  bannerTitle: { fontSize: 25, fontWeight: "800" },
  bannerSubtitle: { fontSize: 15, fontWeight: "600" },
  bannerActions: { flex: 1, gap: 8 },
  bannerAction: { alignSelf: "stretch" },
  bannerProfile: { width: 90, height: 90, borderRadius: 45 },

  emptyText: { textAlign: "center", fontSize: 16, color: "grey", fontWeight: "800" },
});
