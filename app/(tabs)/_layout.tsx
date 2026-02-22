import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import TabBar from "@/components/UI/TabBar/TabBar";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme() ?? "light";

	return (
		<Tabs
			screenOptions={{
				sceneStyle: { backgroundColor: Colors[colorScheme].surface },
				headerShown: false,
			}}
			tabBar={(props) => <TabBar {...props} />}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Esplora",
				}}
			/>
			<Tabs.Screen
				name="favourites"
				options={{
					title: "Preferiti",
				}}
			/>
		</Tabs>
	);
}
