import React from 'react';

export default function Footer() {
    return (
        <>
            <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
                <p>Use the sliders to dial in your actual setup—screen diagonal, aspect ratio, eye-to-screen distance
                    (measure from your eyes to the centre of your main screen), and bezel size. The planner then finds
                    the perfect angle so distances to all screen edges are the same.</p>
                <p><strong>Horizontal FOV</strong> shows your in-game side-to-side field of view, while <strong>Vertical
                    FOV</strong> tells you how much screen height you cover—useful for seeing your dash and brake
                    markers.</p>
                <p><strong>Total width</strong> is the straight-line distance between the outer edges of your side
                    screens, so you know exactly how much floor space to reserve.</p>
                <p>The <strong>light-grey box</strong> represents a standard sim cockpit: 60 cm × 150 cm with your head
                    (red circle) 10 cm from the back edge of the rig.</p>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
                <a href="https://github.com/anzax/triple-screen-planner"
                                   className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">View
                on GitHub</a>. Found a bug or have feedback? <a
                href="https://github.com/anzax/triple-screen-planner/issues" className="underline hover:text-blue-600"
                target="_blank" rel="noopener noreferrer">Open an issue</a>.
            </div>
        </>
    );
}