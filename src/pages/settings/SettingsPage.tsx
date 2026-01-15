import React from 'react'
import PermissionMatrix from '../../modules/system/components/PermissionMatrix'
import RoleManagement from '../../modules/system/components/RoleManagement'
import IntegrationCard from '../../modules/system/components/IntegrationCard'
import SettingsHeader from '../../modules/system/components/SettingsHeader'
import usePermissions from '../../modules/system/hooks/usePermissions'

const SettingsPage: React.FC = () => {
	const {
		roles,
		actions,
		groupedActions,
		permissions,
		selectedRoleId,
		setSelectedRoleId,
		addRole,
		togglePermission,
		saveChanges,
		testS3Integration,
		testSSOIntegration
	} = usePermissions()

	const handleSave = async () => {
		await saveChanges()
	}

	return (
		<div className="h-full bg-background-light dark:bg-background-dark flex flex-col">
			<SettingsHeader onTestS3={() => void testS3Integration()} onTestSSO={() => void testSSOIntegration()} onSave={() => void handleSave()} />

			<div className="flex-1 overflow-y-auto p-6">
				<div className="max-w-6xl mx-auto flex flex-col gap-6">
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
						<div className="xl:col-span-1">
							<RoleManagement roles={roles} selectedRoleId={selectedRoleId} onSelect={setSelectedRoleId} onAddRole={addRole} />
						</div>
						<div className="xl:col-span-2">
							<PermissionMatrix roleId={selectedRoleId} groupedActions={groupedActions} permissions={permissions} onToggle={togglePermission} />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<IntegrationCard
							title="对象存储 (S3) 集成"
							description="配置访问密钥与桶名后可在此触发测试。当前为占位按钮。"
							actionLabel="测试连接 (stub)"
							onAction={() => void testS3Integration()}
						/>
						<IntegrationCard
							title="单点登录 (SSO)"
							description="支持 SAML / OAuth。此处为占位测试入口，后续接入真实配置。"
							actionLabel="发起 SSO 测试 (stub)"
							onAction={() => void testSSOIntegration()}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SettingsPage
