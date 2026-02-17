import Button from "@/components/UI/Button";
import { Text } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
	RefreshControl,
	ScrollView,
	StyleSheet,
	useColorScheme,
	View,
} from "react-native";

export default function TabOneScreen() {
	const theme = useColorScheme() ?? "light";
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = () => {
		setRefreshing(true);
		// Simulate a network request
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	};

	return (
		<>
			<StatusBar style={theme === "dark" ? "light" : "dark"} />
			<View
				style={{
					marginTop: Constants.statusBarHeight + 10,
					backgroundColor: Colors[theme].surface,
					paddingHorizontal: 16,
					paddingVertical: 6,
					alignItems: "center",
					justifyContent: "space-between",
					flexDirection: "row",
				}}>
				<Text style={styles.title}>Cocktails</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-end",
					}}>
					<Button
						IconRight={() => (
							<FontAwesome5
								name="cocktail"
								size={22}
								color={Colors[theme].background}
							/>
						)}
						label="Stupiscimi"
						onPress={() => {}}
						backgroundColor={Colors[theme].tint}
						labelColor={Colors[theme].background}
					/>
				</View>
			</View>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={Colors[theme].tint}
						colors={[Colors[theme].tint]}
						progressBackgroundColor={Colors[theme].surface}
						// enabled={!isLoading}
						title="Aggiorno le informazioni..."
						titleColor={Colors[theme].tint}
					/>
				}
				style={[
					styles.container,
					{
						zIndex: 1,
					},
				]}>
				<View
					style={{
						minHeight: "100%",
						backgroundColor: Colors[theme].background,
						borderTopLeftRadius: 18,
						borderTopRightRadius: 18,
						marginTop: 10,
						boxShadow: `0 0 10px rgba(0,0,0,0.1)`,
					}}></View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
	},
});
