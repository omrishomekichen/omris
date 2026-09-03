import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Database,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Smartphone,
  HardDrive,
} from 'lucide-react-native';
import type { SplashScreenProps } from '../types';

const { width, height } = Dimensions.get('window');

 const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  autoDismiss = true,
  dismissDelayMs = 2200,
}) => {
  const [initStage, setInitStage] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  const stages = [
    {
      label: 'Initializing Local SQLite Engine...',
      icon: HardDrive,
    },
    {
      label: 'Loading Fast In-Memory Cache...',
      icon: Database,
    },
    {
      label: 'Verifying Security & Role Access...',
      icon: ShieldCheck,
    },
    {
      label: 'Aira Kitchen Console Ready!',
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setInitStage(1), 500);

    const t2 = setTimeout(() => setInitStage(2), 1100);

    const t3 = setTimeout(() => {
      setInitStage(3);
      setIsReady(true);
    }, 1700);

    let dismissTimer: ReturnType<typeof setTimeout> | null = null;

    if (autoDismiss) {
      dismissTimer = setTimeout(() => {
        onFinish?.();
      }, dismissDelayMs);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [autoDismiss, dismissDelayMs, onFinish]);

  const CurrentIcon = stages[initStage]?.icon || HardDrive;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundPattern} />

      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* Top Header */}
     

      {/* Center Content */}
      <View style={styles.centerContent}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <Image
              source={require('../../../assets/images/aira-pickles-logo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          <View style={styles.glowRing} />
        </View>

        {/* Brand */}
        <View style={styles.brandContainer}>
          <Text style={styles.title}>
            AIRA PICKLES
          </Text>

          <Text style={styles.subtitle}>
            Handcrafted Traditional Pickles & Podis
          </Text>

          <Text style={styles.description}>
            Kitchen Management & Order Fulfillment Console
          </Text>
        </View>

        {/* Boot Sequence */}
        <View style={styles.bootContainer}>

          {/* Progress Bar */}
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((initStage + 1) / stages.length) * 100
                    }%`,
                },
              ]}
            />
          </View>

          {/* Current Stage */}
          <View style={styles.stageContainer}>
            <View style={styles.pingDot} />

            <CurrentIcon
              size={14}
              color="#ffd166"
            />

            <Text style={styles.stageText}>
              {stages[initStage]?.label}
            </Text>
          </View>
        </View>
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a0500',
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  /* Background */

  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4a0500',
    opacity: 0.15,
  },

  topGlow: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: '#f59e0b',
    opacity: 0.08,
    top: -120,
    right: -120,
  },

  bottomGlow: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: '#ef4444',
    opacity: 0.08,
    bottom: -120,
    left: -120,
  },

  /* Header */

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    zIndex: 10,
  },

  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  offlineText: {
    color: 'rgba(255,209,102,0.85)',
    fontSize: 11,
    fontFamily: 'monospace',
  },


  /* Center */

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    zIndex: 10,
  },

  logoContainer: {
    position: 'relative',
    marginBottom: 24,
  },

  logoOuter: {
    width: Math.min(width * 0.32, 128),
    height: Math.min(width * 0.32, 128),
    borderRadius: Math.min(width * 0.16, 64),
    padding: 6,

    backgroundColor: '#fbbf24',

    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.10)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 15,
  },

  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },

  glowRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.30)',
  },

  /* Brand */

  brandContainer: {
    alignItems: 'center',
    width: '100%',
  },

  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  subtitle: {
    color: 'rgba(255,224,138,0.90)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginTop: 5,
    textAlign: 'center',
  },

  description: {
    color: 'rgba(255,218,212,0.70)',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 3,
    textAlign: 'center',
  },

  /* Boot */

  bootContainer: {
    width: '100%',
    maxWidth: 320,
    marginTop: 32,
  },

  progressBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 10,
  },

  stageContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 7,
  },

  pingDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: '#fbbf24',
  },

  stageText: {
    color: '#e7e5e4',
    fontSize: 11,
    fontFamily: 'monospace',
    textAlign: 'center',
  },

  /* Footer */

  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 16,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    zIndex: 10,
  },

  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexShrink: 1,
  },

  storageText: {
    color: 'rgba(231,229,228,0.80)',
    fontSize: 11,
  },

  readyText: {
    color: 'rgba(255,224,138,0.60)',
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'right',
  },

  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  buttonPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#fcd34d',
  },

  openButtonText: {
    color: '#4a0500',
    fontSize: 11,
    fontWeight: '700',
  },
});
export default SplashScreen;