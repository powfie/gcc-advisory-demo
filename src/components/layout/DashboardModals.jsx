import { MODAL_KEYS, useUI } from '../../context/UIContext.jsx';
import { useClient } from '../../context/ClientContext.jsx';
import { useCompliance } from '../../context/ComplianceContext.jsx';
import { AddClientModal } from '../ui/AddClientModal.jsx';
import { ClientDossierDrawer } from '../ui/ClientDossierDrawer.jsx';
import { DtaaModal } from '../ui/DtaaModal.jsx';
import { EditClientModal } from '../ui/EditClientModal.jsx';
import { EntitySimulatorModal } from '../ui/EntitySimulatorModal.jsx';
import { EtrModal } from '../ui/EtrModal.jsx';
import { InviteModal } from '../ui/InviteModal.jsx';
import { PeExpatModal } from '../ui/PeExpatModal.jsx';
import { SezModal } from '../ui/SezModal.jsx';
import { TpEngineModal } from '../ui/TpEngineModal.jsx';

export function DashboardModals() {
  const ui = useUI();
  const c = useClient();
  const m = useCompliance();

  return (
    <>
      <TpEngineModal
        open={ui.modals[MODAL_KEYS.tpEngine]}
        onClose={() => ui.closeModal(MODAL_KEYS.tpEngine)}
        revenue={m.revenue}
        setRevenue={m.setRevenue}
        calculatedProfit={m.calculatedProfit}
        onCalculate={m.handleCalculateTP}
      />
      <EtrModal
        open={ui.modals[MODAL_KEYS.etr]}
        onClose={() => {
          ui.closeModal(MODAL_KEYS.etr);
          m.setEtrResult(null);
        }}
        globalRevenue={m.globalRevenue}
        setGlobalRevenue={m.setGlobalRevenue}
        indianProfit={m.indianProfit}
        setIndianProfit={m.setIndianProfit}
        indianTax={m.indianTax}
        setIndianTax={m.setIndianTax}
        etrResult={m.etrResult}
        onCalculate={m.handleCalculateETR}
      />
      <DtaaModal
        open={ui.modals[MODAL_KEYS.dtaa]}
        onClose={() => {
          ui.closeModal(MODAL_KEYS.dtaa);
          m.setDtaaResult(null);
        }}
        dtaaCountry={m.dtaaCountry}
        setDtaaCountry={m.setDtaaCountry}
        dtaaAmount={m.dtaaAmount}
        setDtaaAmount={m.setDtaaAmount}
        dtaaResult={m.dtaaResult}
        onCalculate={m.handleCalculateDTAA}
      />
      <EntitySimulatorModal
        open={ui.modals[MODAL_KEYS.entity]}
        onClose={() => ui.closeModal(MODAL_KEYS.entity)}
        headcount={m.headcount}
        setHeadcount={m.setHeadcount}
        opCost={m.opCost}
        setOpCost={m.setOpCost}
        showEntityResults={m.showEntityResults}
        setShowEntityResults={m.setShowEntityResults}
      />
      <SezModal
        open={ui.modals[MODAL_KEYS.sez]}
        onClose={() => {
          ui.closeModal(MODAL_KEYS.sez);
          m.setSezResult(null);
        }}
        sezRevenue={m.sezRevenue}
        setSezRevenue={m.setSezRevenue}
        sezMargin={m.sezMargin}
        setSezMargin={m.setSezMargin}
        sezHeadcount={m.sezHeadcount}
        setSezHeadcount={m.setSezHeadcount}
        sezResult={m.sezResult}
        onCalculate={m.handleCalculateSEZ}
      />
      <PeExpatModal
        open={ui.modals[MODAL_KEYS.peExpat]}
        onClose={() => ui.closeModal(MODAL_KEYS.peExpat)}
        expats={m.expats}
      />
      <AddClientModal
        open={ui.modals[MODAL_KEYS.addClient]}
        onClose={() => ui.closeModal(MODAL_KEYS.addClient)}
        newClient={c.newClient}
        setNewClient={c.setNewClient}
        onSubmit={c.handleAddClient}
        isSubmitting={c.isSubmitting}
      />
      <EditClientModal
        open={ui.modals[MODAL_KEYS.editClient]}
        onClose={() => ui.closeModal(MODAL_KEYS.editClient)}
        editingClient={c.editingClient}
        setEditingClient={c.setEditingClient}
        onSubmit={c.handleUpdateClient}
        onDelete={c.handleDeleteClient}
        isSubmitting={c.isSubmitting}
      />
      <InviteModal
        open={ui.modals[MODAL_KEYS.invite]}
        onClose={() => ui.closeModal(MODAL_KEYS.invite)}
        inviteEmail={m.inviteEmail}
        setInviteEmail={m.setInviteEmail}
        inviteRole={m.inviteRole}
        setInviteRole={m.setInviteRole}
        onSend={() => {
          m.sendInvite();
          ui.closeModal(MODAL_KEYS.invite);
        }}
      />
      <ClientDossierDrawer
        open={ui.dossier.open}
        selectedClient={ui.dossier.client}
        dossierTab={ui.dossier.tab}
        setDossierTab={ui.setDossierTab}
        onClose={ui.closeDossier}
        onOpenEdit={c.requestEditClient}
        onDeleteClient={c.handleDeleteClient}
      />
    </>
  );
}
