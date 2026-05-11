import { useEffect, useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function OnboardingTour() {
    const [run, setRun] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if user has already seen the tour
        const hasSeenTour = localStorage.getItem('harborbank_tour_v1');
        if (!hasSeenTour) {
            // Start tour after a short delay so the DOM is fully loaded and animations finish
            const timer = setTimeout(() => {
                setRun(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('harborbank_tour_v1', 'true');
        }
    };

    const steps = [
        {
            target: 'body',
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-black text-xl mb-2 text-gray-900">Welcome to HarborBank! 👋</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        We're thrilled to have you on board. Let's take a quick tour to show you how to navigate your new premium financial dashboard.
                    </p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '#tour-balance',
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Your Financial Hub</h3>
                    <p className="text-gray-600 text-sm">
                        This is your primary balance. You can instantly see your available funds and switch between different currencies or accounts.
                    </p>
                </div>
            ),
            placement: 'bottom',
        },
        {
            target: '#tour-transfer',
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Lightning Fast Transfers</h3>
                    <p className="text-gray-600 text-sm">
                        Need to send money? Use our Quick Transfer widget to instantly send funds globally, or use the QR Code scanner.
                    </p>
                </div>
            ),
            placement: 'top',
        },
        {
            target: '#tour-sidebar',
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Explore Your Tools</h3>
                    <p className="text-gray-600 text-sm">
                        Access all your features here: Transactions, Cards, Investments, and even your personalized AI Assistant.
                    </p>
                </div>
            ),
            placement: 'right',
        },
        {
            target: '#tour-search',
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Find Anything</h3>
                    <p className="text-gray-600 text-sm">
                        Our powerful search bar lets you instantly find any page, feature, or transaction on the entire platform.
                    </p>
                </div>
            ),
            placement: 'bottom',
        }
    ];

    if (!isMounted) return null;

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            floaterProps={{
                disableAnimation: false,
            }}
            styles={{
                options: {
                    arrowColor: '#ffffff',
                    backgroundColor: '#ffffff',
                    primaryColor: '#09090b',
                    textColor: '#1f2937',
                    zIndex: 10000, // Ensure it's above everything including header
                },
                tooltip: {
                    borderRadius: '24px',
                    padding: '24px',
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                buttonNext: {
                    backgroundColor: '#09090b',
                    borderRadius: '9999px',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    fontSize: '14px',
                },
                buttonBack: {
                    marginRight: '14px',
                    color: '#6b7280',
                    fontWeight: 'bold',
                },
                buttonSkip: {
                    color: '#9ca3af',
                    fontWeight: 'bold',
                    fontSize: '12px',
                }
            }}
            locale={{
                back: 'Back',
                close: 'Close',
                last: 'Finish',
                next: 'Next',
                skip: 'Skip Tour',
            }}
        />
    );
}
