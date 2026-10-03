import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'

export default function TestSignalR() {
    const [connectionStatus, setConnectionStatus] = useState('Disconnected')
    const [connectionId, setConnectionId] = useState(null)
    const [logs, setLogs] = useState([])
    const [connection, setConnection] = useState(null)

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [...prev, { timestamp, message, type }])
        console.log(`[${timestamp}] ${message}`)
    }

    useEffect(() => {
        addLog(`Hub URL: /api/hubs/messaging`)

        // Create connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`/api/hubs/messaging`, {
                transport: signalR.HttpTransportType.WebSockets |
                    signalR.HttpTransportType.ServerSentEvents |
                    signalR.HttpTransportType.LongPolling,
                skipNegotiation: false
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Debug)
            .build()

        // Event handlers
        newConnection.onreconnecting((error) => {
            addLog('🔄 Reconnecting...', 'warning')
            setConnectionStatus('Reconnecting')
        })

        newConnection.onreconnected((connectionId) => {
            addLog(`✅ Reconnected: ${connectionId}`, 'success')
            setConnectionStatus('Connected')
            setConnectionId(connectionId)
        })

        newConnection.onclose((error) => {
            addLog(`❌ Connection closed: ${error?.message || 'Unknown'}`, 'error')
            setConnectionStatus('Disconnected')
            setConnectionId(null)
        })

        // Test message handler
        newConnection.on('ReceiveMessage', (message) => {
            addLog(`📨 Received message: ${JSON.stringify(message)}`, 'success')
        })

        // Start connection
        const startConnection = async () => {
            try {
                addLog('🔌 Starting connection...')
                setConnectionStatus('Connecting')

                await newConnection.start()

                addLog(`✅ Connected! Connection ID: ${newConnection.connectionId}`, 'success')
                setConnectionStatus('Connected')
                setConnectionId(newConnection.connectionId)

                // Test RegisterUser method
                try {
                    await newConnection.invoke('RegisterUser', '123')
                    addLog('✅ RegisterUser invoked successfully', 'success')
                } catch (err) {
                    addLog(`⚠️ RegisterUser failed: ${err.message}`, 'warning')
                }

                // Test JoinConversation method
                try {
                    await newConnection.invoke('JoinConversation', '1')
                    addLog('✅ JoinConversation invoked successfully', 'success')
                } catch (err) {
                    addLog(`⚠️ JoinConversation failed: ${err.message}`, 'warning')
                }

            } catch (err) {
                addLog(`❌ Connection failed: ${err.message}`, 'error')
                setConnectionStatus('Failed')
                console.error('Full error:', err)
            }
        }

        startConnection()
        setConnection(newConnection)

        // Cleanup
        return () => {
            if (newConnection) {
                newConnection.stop()
            }
        }
    }, [])

    const testSendTyping = async () => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke('SendTypingIndicator', '1', true)
                addLog('✅ SendTypingIndicator invoked', 'success')
            } catch (err) {
                addLog(`❌ SendTypingIndicator failed: ${err.message}`, 'error')
            }
        } else {
            addLog('❌ Not connected', 'error')
        }
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>SignalR Connection Test</h1>

            <div style={{ marginBottom: '20px' }}>
                <h2>Connection Status</h2>
                <div style={{
                    padding: '10px',
                    background: connectionStatus === 'Connected' ? '#d4edda' :
                        connectionStatus === 'Connecting' ? '#fff3cd' : '#f8d7da',
                    borderRadius: '5px'
                }}>
                    <strong>Status:</strong> {connectionStatus}
                    {connectionId && <div><strong>Connection ID:</strong> {connectionId}</div>}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Environment</h2>
                <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                    <div><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || '(not set)'}</div>
                    <div><strong>Node ENV:</strong> {process.env.NODE_ENV}</div>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Actions</h2>
                <button
                    onClick={testSendTyping}
                    disabled={connectionStatus !== 'Connected'}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        cursor: connectionStatus === 'Connected' ? 'pointer' : 'not-allowed'
                    }}
                >
                    Test SendTypingIndicator
                </button>
            </div>

            <div>
                <h2>Logs</h2>
                <div style={{
                    background: '#000',
                    color: '#0f0',
                    padding: '10px',
                    borderRadius: '5px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    fontSize: '12px'
                }}>
                    {logs.map((log, index) => (
                        <div
                            key={index}
                            style={{
                                color: log.type === 'error' ? '#ff6b6b' :
                                    log.type === 'success' ? '#51cf66' :
                                        log.type === 'warning' ? '#ffd43b' : '#0f0'
                            }}
                        >
                            [{log.timestamp}] {log.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}