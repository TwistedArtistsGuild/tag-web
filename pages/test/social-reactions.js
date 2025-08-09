/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import SocialReactions from '@/components/social/Reactions';

export default function SocialTest() {
    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8">Social Reactions Test</h1>
                
                {/* Test 1: Basic reactions */}
                <div className="bg-base-100 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Reactions (Medium)</h2>
                    <SocialReactions
                        targetId="test-1"
                        targetType="test"
                        size="md"
                        showDetails={true}
                        showQuickReactions={true}
                    />
                </div>

                {/* Test 2: Small reactions */}
                <div className="bg-base-100 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Small Reactions</h2>
                    <SocialReactions
                        targetId="test-2"
                        targetType="test"
                        size="sm"
                        showDetails={false}
                        showQuickReactions={true}
                    />
                </div>

                {/* Test 3: Large reactions */}
                <div className="bg-base-100 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Large Reactions</h2>
                    <SocialReactions
                        targetId="test-3"
                        targetType="test"
                        size="lg"
                        showDetails={true}
                        showQuickReactions={true}
                    />
                </div>

                {/* Test 4: With initial reactions */}
                <div className="bg-base-100 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">With Initial Reactions</h2>
                    <SocialReactions
                        targetId="test-4"
                        targetType="test"
                        size="md"
                        showDetails={true}
                        showQuickReactions={true}
                        initialReactions={[
                            { emoji: '👍', userId: 'user1', username: 'Alice', timestamp: new Date().toISOString() },
                            { emoji: '❤️', userId: 'user2', username: 'Bob', timestamp: new Date().toISOString() },
                            { emoji: '👍', userId: 'user3', username: 'Charlie', timestamp: new Date().toISOString() }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
