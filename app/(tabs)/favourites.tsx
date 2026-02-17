import { StyleSheet, useColorScheme } from "react-native";

import { Text, View } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";

export default function Favourites() {
	const theme = useColorScheme() ?? "light";
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab Two</Text>
			<View
				style={styles.separator}
				lightColor={Colors[theme].surface}
				darkColor={Colors[theme].surface}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
