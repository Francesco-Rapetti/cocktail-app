import Snackbar from "@/components/UI/SnackBar";
import { usePersistenceSubscription } from "@/hooks/usePersistenceSubscription";
import { useAppStore } from "@/stores/AppStore";
import { InitializeAppUseCase } from "@/useCases/InitializeAppUseCase";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	const isAppInitialized = useAppStore((state) => state.isInitialized);

	useEffect(() => {
		if (fontError) throw fontError;
	}, [fontError]);

	useEffect(() => {
		const initApp = async () => {
			const useCase = new InitializeAppUseCase();
			await useCase.execute();
		};
		initApp();
	}, []);

	useEffect(() => {
		if (fontsLoaded && isAppInitialized) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, isAppInitialized]);

	if (!fontsLoaded || !isAppInitialized) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	usePersistenceSubscription();

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Snackbar />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="cocktailDetail" />
			</Stack>
		</ThemeProvider>
	);
}
