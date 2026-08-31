import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import {
    Lock,
    Mail,
    Eye,
    EyeOff,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    KeyRound,
} from 'lucide-react-native';

import { useAuth } from '../../Context/AuthContext';

/* =====================================================
   DEMO OPERATORS
   ===================================================== */



/* =====================================================
   LOGIN SCREEN
   ===================================================== */

export default function LoginScreen() {

    const [email, setEmail] = useState(
        'ananya@airapickles.com'
    );

    const [password, setPassword] = useState(
        'admin@aira2026'
    );

    const [showPassword, setShowPassword] =
        useState(false);

    const [rememberMe, setRememberMe] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [isLoading, setIsLoading] =
        useState(false);

    const [successAnimation, setSuccessAnimation] =
        useState(false);
    const { login } = useAuth();


    /* ===================================================
       LOGIN
       =================================================== */

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim()) {
        setErrorMessage('Operator email address is required.');
        return;
    }

    if (!email.includes('@')) {
        setErrorMessage('Please enter a valid business email address.');
        return;
    }

    if (!password || password.length < 4) {
        setErrorMessage('Security passcode must be at least 4 characters.');
        return;
    }

    setIsLoading(true);

    try {
        const result = await login(email, password);

        if (!result.success) {
            setErrorMessage(result.error || 'Login failed');
            return;
        }

        setSuccessAnimation(true);
    } catch (error) {
        setErrorMessage('Something went wrong. Please try again.');
    } finally {
        setIsLoading(false);
    }
};

``


    return (

        <KeyboardAvoidingView
            style={styles.screen}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
            }
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >

                {/* =================================================
            BACKGROUND DECORATION
            ================================================= */}

                <View style={styles.topGlow} />

                <View style={styles.bottomGlow} />


                {/* =================================================
            MAIN CONTENT
            ================================================= */}

                <View style={styles.content}>


                    {/* =================================================
              BRAND
              ================================================= */}

                    <View style={styles.brandContainer}>

                        {/* LOGO */}

                        <View style={styles.logoOuter}>

                            <View style={styles.logoInner}>

                                <Text style={styles.logoText}>
                                    A
                                </Text>

                            </View>

                        </View>


                        <Text style={styles.brandTitle}>
                            Aira Pickles
                        </Text>

                        <Text style={styles.brandSubtitle}>
                            Traditional Taste • Pure Ingredients
                        </Text>

                        <Text style={styles.consoleText}>
                            Operations Console
                        </Text>


                        {/* STATUS */}

                        <View style={styles.productionStatus}>

                            <View style={styles.statusDot} />

                            <Text style={styles.statusText}>
                                Production Gateway • v2.4 Active
                            </Text>

                        </View>

                    </View>


                    {/* =================================================
              LOGIN CARD
              ================================================= */}

                    <View style={styles.loginCard}>


                        {/* HEADER */}

                        <View style={styles.loginHeader}>

                            <View style={styles.loginHeaderText}>

                                <Text style={styles.loginTitle}>
                                    Operator Sign In
                                </Text>

                                <Text style={styles.loginSubtitle}>
                                    Authenticate with your assigned
                                    staff clearance
                                </Text>

                            </View>


                            <View style={styles.securityIcon}>

                                <ShieldCheck
                                    size={22}
                                    color="#650700"
                                />

                            </View>

                        </View>


                        {/* =================================================
                ERROR
                ================================================= */}

                        {errorMessage && (

                            <View style={styles.errorBox}>

                                <AlertCircle
                                    size={17}
                                    color="#b91c1c"
                                />

                                <Text style={styles.errorText}>
                                    {errorMessage}
                                </Text>

                            </View>

                        )}


                        {/* =================================================
                EMAIL
                ================================================= */}

                        <View style={styles.inputGroup}>

                            <Text style={styles.inputLabel}>
                                Operator Email
                            </Text>

                            <View style={styles.inputContainer}>

                                <Mail
                                    size={17}
                                    color="#a8a29e"
                                />

                                <TextInput
                                    value={email}
                                    onChangeText={(value) => {
                                        setEmail(value);
                                        setErrorMessage(null);
                                    }}
                                    placeholder="name@airapickles.com"
                                    placeholderTextColor="#a8a29e"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.input}
                                />

                            </View>

                        </View>


                        {/* =================================================
                PASSWORD
                ================================================= */}

                        <View style={styles.inputGroup}>

                            <View style={styles.passwordLabelRow}>

                                <Text style={styles.inputLabel}>
                                    Security Passcode
                                </Text>

                                <Text style={styles.demoText}>
                                    Demo: Any passcode
                                </Text>

                            </View>


                            <View style={styles.inputContainer}>

                                <Lock
                                    size={17}
                                    color="#a8a29e"
                                />

                                <TextInput
                                    value={password}
                                    onChangeText={(value) => {
                                        setPassword(value);
                                        setErrorMessage(null);
                                    }}
                                    placeholder="••••••••"
                                    placeholderTextColor="#a8a29e"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    style={styles.input}
                                />


                                <Pressable
                                    onPress={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    style={styles.eyeButton}
                                >

                                    {showPassword ? (

                                        <EyeOff
                                            size={17}
                                            color="#78716c"
                                        />

                                    ) : (

                                        <Eye
                                            size={17}
                                            color="#78716c"
                                        />

                                    )}

                                </Pressable>

                            </View>

                        </View>


                        {/* =================================================
                REMEMBER
                ================================================= */}

                        <Pressable
                            onPress={() =>
                                setRememberMe(!rememberMe)
                            }
                            style={styles.rememberRow}
                        >

                            <View
                                style={[
                                    styles.checkbox,
                                    rememberMe &&
                                    styles.checkboxActive,
                                ]}
                            >

                                {rememberMe && (

                                    <CheckCircle2
                                        size={13}
                                        color="#ffffff"
                                    />

                                )}

                            </View>

                            <Text style={styles.rememberText}>
                                Persist token on this terminal
                            </Text>

                        </Pressable>


                        {/* =================================================
                LOGIN BUTTON
                ================================================= */}

                        <Pressable
                            onPress={handleLogin}
                            disabled={
                                isLoading ||
                                successAnimation
                            }
                            style={({ pressed }) => [

                                styles.loginButton,

                                pressed &&
                                styles.loginButtonPressed,

                                (isLoading ||
                                    successAnimation) &&
                                styles.loginButtonDisabled,

                            ]}
                        >

                            {isLoading ? (

                                <>

                                    <View style={styles.loadingSpinner} />

                                    <Text style={styles.loginButtonText}>
                                        Verifying clearance...
                                    </Text>

                                </>

                            ) : successAnimation ? (

                                <>

                                    <CheckCircle2
                                        size={17}
                                        color="#86efac"
                                    />

                                    <Text style={styles.successButtonText}>
                                        Access Granted!
                                    </Text>

                                </>

                            ) : (

                                <>

                                    <Text style={styles.loginButtonText}>
                                        Authenticate Operator
                                    </Text>

                                    <ArrowRight
                                        size={17}
                                        color="#ffffff"
                                    />

                                </>

                            )}

                        </Pressable>


                        {/* =================================================
                QUICK ACCESS
                ================================================= */}

                        <View style={styles.quickAccess}>

                            <View style={styles.quickHeader}>

                                <View style={styles.quickTitleRow}>

                                    <KeyRound
                                        size={14}
                                        color="#b45309"
                                    />

                                    <Text style={styles.quickTitle}>
                                        Quick Access Roster
                                    </Text>

                                </View>

                                <Text style={styles.quickHint}>
                                    Click to autofill
                                </Text>

                            </View>




                        </View>

                    </View>


                    {/* =================================================
              SECURITY FOOTER
              ================================================= */}

                    <View style={styles.securityFooter}>

                        <Text style={styles.rbacTitle}>
                            Role-Based Access Control (RBAC) enforced
                        </Text>

                        <Text style={styles.rbacText}>
                            • Super Admin: Omni-access across all
                            branches & multi-account switching.
                        </Text>

                        <Text style={styles.rbacText}>
                            • Branch Operators / Staff: Authorized
                            for local branch orders & Stock Management.
                        </Text>

                    </View>


                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    );
}


/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: '#faf7f4',
    },

    scrollContent: {
        flexGrow: 1,
        paddingVertical: 35,
        paddingHorizontal: 18,
    },

    content: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },


    /* BACKGROUND */

    topGlow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#650700',
        opacity: 0.06,
        top: -130,
        left: -120,
    },

    bottomGlow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#f59e0b',
        opacity: 0.08,
        bottom: -120,
        right: -120,
    },


    /* BRAND */

    brandContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },

    logoOuter: {
        width: 105,
        height: 105,

        borderRadius: 53,

        backgroundColor: '#ffffff',

        borderWidth: 3,

        borderColor: '#fcd34d',

        padding: 5,

        elevation: 7,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.15,

        shadowRadius: 8,

        marginBottom: 11,
    },

    logoInner: {
        flex: 1,

        borderRadius: 50,

        backgroundColor: '#650700',

        alignItems: 'center',

        justifyContent: 'center',
    },

    logoText: {
        color: '#fbbf24',

        fontSize: 45,

        fontWeight: '900',

        fontFamily: 'serif',
    },

    brandTitle: {
        color: '#650700',

        fontSize: 28,

        fontWeight: '900',

        letterSpacing: -0.5,
    },

    brandSubtitle: {
        color: '#59413c',

        fontSize: 11,

        fontWeight: '600',

        marginTop: 4,

        textAlign: 'center',
    },

    consoleText: {
        color: '#78716c',

        fontSize: 10,

        marginTop: 3,

        fontWeight: '500',
    },

    productionStatus: {
        flexDirection: 'row',

        alignItems: 'center',

        marginTop: 9,

        gap: 6,
    },

    statusDot: {
        width: 7,

        height: 7,

        borderRadius: 4,

        backgroundColor: '#10b981',
    },

    statusText: {
        color: '#166534',

        fontSize: 9,

        fontWeight: '800',

        letterSpacing: 0.3,

        textTransform: 'uppercase',
    },


    /* LOGIN CARD */

    loginCard: {
        backgroundColor: '#ffffff',

        borderRadius: 22,

        borderWidth: 1,

        borderColor: '#e7e0da',

        padding: 20,

        elevation: 5,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 5,
        },

        shadowOpacity: 0.08,

        shadowRadius: 12,
    },


    /* HEADER */

    loginHeader: {
        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginBottom: 20,
    },

    loginHeaderText: {
        flex: 1,
    },

    loginTitle: {
        color: '#1c1917',

        fontSize: 18,

        fontWeight: '800',
    },

    loginSubtitle: {
        color: '#78716c',

        fontSize: 10,

        marginTop: 4,

        lineHeight: 15,
    },

    securityIcon: {
        width: 40,

        height: 40,

        borderRadius: 12,

        backgroundColor: '#fdf4ef',

        alignItems: 'center',

        justifyContent: 'center',

        marginLeft: 10,
    },


    /* ERROR */

    errorBox: {
        flexDirection: 'row',

        alignItems: 'flex-start',

        gap: 9,

        backgroundColor: '#fef2f2',

        borderWidth: 1,

        borderColor: '#fecaca',

        borderRadius: 12,

        padding: 12,

        marginBottom: 15,
    },

    errorText: {
        flex: 1,

        color: '#b91c1c',

        fontSize: 10,

        lineHeight: 15,

        fontWeight: '600',
    },


    /* INPUT */

    inputGroup: {
        marginBottom: 15,
    },

    inputLabel: {
        color: '#44403c',

        fontSize: 9,

        fontWeight: '800',

        letterSpacing: 0.8,

        textTransform: 'uppercase',

        marginBottom: 7,
    },

    inputContainer: {
        flexDirection: 'row',

        alignItems: 'center',

        minHeight: 46,

        backgroundColor: '#fafaf9',

        borderWidth: 1,

        borderColor: '#e7e5e4',

        borderRadius: 13,

        paddingHorizontal: 12,
    },

    input: {
        flex: 1,

        color: '#1c1917',

        fontSize: 12,

        paddingHorizontal: 9,

        paddingVertical: 8,
    },

    eyeButton: {
        padding: 5,
    },

    passwordLabelRow: {
        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'space-between',
    },

    demoText: {
        color: '#a8a29e',

        fontSize: 8,
    },


    /* REMEMBER */

    rememberRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginBottom: 17,

        gap: 8,
    },

    checkbox: {
        width: 18,

        height: 18,

        borderRadius: 5,

        borderWidth: 1,

        borderColor: '#d6d3d1',

        alignItems: 'center',

        justifyContent: 'center',
    },

    checkboxActive: {
        backgroundColor: '#650700',

        borderColor: '#650700',
    },

    rememberText: {
        color: '#57534e',

        fontSize: 9,

        fontWeight: '600',
    },


    /* LOGIN BUTTON */

    loginButton: {
        minHeight: 48,

        borderRadius: 13,

        backgroundColor: '#650700',

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'center',

        gap: 8,

        elevation: 3,
    },

    loginButtonPressed: {
        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    loginButtonDisabled: {
        opacity: 0.75,
    },

    loginButtonText: {
        color: '#ffffff',

        fontSize: 11,

        fontWeight: '800',
    },

    successButtonText: {
        color: '#86efac',

        fontSize: 11,

        fontWeight: '800',
    },

    loadingSpinner: {
        width: 15,

        height: 15,

        borderRadius: 8,

        borderWidth: 2,

        borderColor: '#ffffff',

        borderTopColor: 'transparent',
    },


    /* QUICK ACCESS */

    quickAccess: {
        marginTop: 24,

        paddingTop: 20,

        borderTopWidth: 1,

        borderTopColor: '#f0eeec',
    },

    quickHeader: {
        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'space-between',

        marginBottom: 10,
    },

    quickTitleRow: {
        flexDirection: 'row',

        alignItems: 'center',

        gap: 6,
    },

    quickTitle: {
        color: '#44403c',

        fontSize: 9,

        fontWeight: '900',

        letterSpacing: 0.7,

        textTransform: 'uppercase',
    },

    quickHint: {
        color: '#a8a29e',

        fontSize: 8,
    },


    /* OPERATOR */

    operatorCard: {
        flexDirection: 'row',

        alignItems: 'center',

        minHeight: 58,

        paddingHorizontal: 10,

        paddingVertical: 8,

        borderRadius: 13,

        borderWidth: 1,

        borderColor: '#e7e5e4',

        backgroundColor: '#fafaf9',

        marginBottom: 7,
    },

    operatorCardSelected: {
        backgroundColor: '#fffbeb',

        borderColor: '#fcd34d',
    },

    avatar: {
        width: 32,

        height: 32,

        borderRadius: 16,

        backgroundColor: '#57534e',

        alignItems: 'center',

        justifyContent: 'center',

        marginRight: 9,
    },

    adminAvatar: {
        backgroundColor: '#650700',
    },

    managerAvatar: {
        backgroundColor: '#b45309',
    },

    avatarText: {
        color: '#ffffff',

        fontSize: 9,

        fontWeight: '900',
    },

    operatorInfo: {
        flex: 1,

        minWidth: 0,
    },

    operatorNameRow: {
        flexDirection: 'row',

        alignItems: 'center',

        gap: 5,

        flexWrap: 'wrap',
    },

    operatorName: {
        color: '#1c1917',

        fontSize: 10,

        fontWeight: '800',

        maxWidth: '55%',
    },

    roleBadge: {
        borderRadius: 5,

        paddingHorizontal: 5,

        paddingVertical: 2,
    },

    adminBadge: {
        backgroundColor: '#650700',
    },

    managerBadge: {
        backgroundColor: '#fef3c7',

        borderWidth: 1,

        borderColor: '#fcd34d',
    },

    staffBadge: {
        backgroundColor: '#e7e5e4',
    },

    roleText: {
        fontSize: 6.5,

        fontWeight: '900',
    },

    adminRoleText: {
        color: '#ffffff',
    },

    managerRoleText: {
        color: '#78350f',
    },

    staffRoleText: {
        color: '#44403c',
    },

    branchText: {
        color: '#78716c',

        fontSize: 8,

        marginTop: 3,
    },

    autofillText: {
        color: '#a8a29e',

        fontSize: 8,

        fontWeight: '700',

        marginLeft: 5,
    },


    /* FOOTER */

    securityFooter: {
        alignItems: 'center',

        marginTop: 20,

        paddingHorizontal: 8,
    },

    rbacTitle: {
        color: '#59413c',

        fontSize: 9,

        fontWeight: '800',

        marginBottom: 6,

        textAlign: 'center',
    },

    rbacText: {
        color: '#78716c',

        fontSize: 8,

        lineHeight: 14,

        textAlign: 'center',

        marginBottom: 2,
    },

});