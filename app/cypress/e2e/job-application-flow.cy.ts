describe('Privacy-Preserving Job Application Flow', () => {
  beforeEach(() => {
    // Reset database or use test fixtures
    cy.task('log', 'Starting job application flow test')
    cy.visit('/')
  })

  it('should complete the full job application workflow with ZK proofs', () => {
    // 1. Browse jobs without authentication
    cy.get('[data-cy=browse-jobs]').click()
    cy.url().should('include', '/jobs')
    cy.get('[data-cy=job-card]').should('exist')

    // 2. View job details
    cy.get('[data-cy=job-card]').first().click()
    cy.url().should('include', '/jobs/')
    cy.get('[data-cy=job-title]').should('be.visible')
    cy.get('[data-cy=apply-button]').should('exist')

    // 3. Connect wallet (mock)
    cy.get('[data-cy=connect-wallet]').click()
    cy.get('[data-cy=wallet-modal]').should('be.visible')
    cy.get('[data-cy=midnight-wallet]').click()
    cy.get('[data-cy=wallet-connected]').should('be.visible')

    // 4. Start application process
    cy.get('[data-cy=apply-button]').click()
    cy.get('[data-cy=zk-stepper]').should('be.visible')

    // 5. Step 1: Skills verification
    cy.get('[data-cy=step-1]').should('have.class', 'active')
    cy.get('[data-cy=skill-slider-programming]').invoke('val', 85).trigger('input')
    cy.get('[data-cy=skill-slider-rust]').invoke('val', 75).trigger('input')
    cy.get('[data-cy=skill-slider-frontend]').invoke('val', 70).trigger('input')
    cy.get('[data-cy=next-step]').click()

    // 6. Step 2: Location verification
    cy.get('[data-cy=step-2]').should('have.class', 'active')
    cy.get('[data-cy=region-select]').select('US-CA')
    cy.get('[data-cy=privacy-toggle]').check()
    cy.get('[data-cy=next-step]').click()

    // 7. Step 3: Salary verification
    cy.get('[data-cy=step-3]').should('have.class', 'active')
    cy.get('[data-cy=salary-input]').type('120000')
    cy.get('[data-cy=salary-private]').check()
    cy.get('[data-cy=generate-proof]').click()

    // 8. Wait for proof generation
    cy.get('[data-cy=proof-generating]').should('be.visible')
    cy.get('[data-cy=proof-complete]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-cy=privacy-score]').should('contain', '%')

    // 9. Submit application
    cy.get('[data-cy=submit-application]').click()
    cy.get('[data-cy=submission-loading]').should('be.visible')
    cy.get('[data-cy=submission-success]', { timeout: 10000 }).should('be.visible')

    // 10. Verify receipt page
    cy.url().should('include', '/receipt/')
    cy.get('[data-cy=transaction-hash]').should('be.visible')
    cy.get('[data-cy=privacy-score]').should('be.visible')
    cy.get('[data-cy=zk-proof-hash]').should('be.visible')

    // 11. Download receipt
    cy.get('[data-cy=download-receipt]').click()

    // 12. Check applications page
    cy.get('[data-cy=view-applications]').click()
    cy.url().should('include', '/applications')
    cy.get('[data-cy=application-card]').should('exist')
    cy.get('[data-cy=application-status]').should('contain', 'pending')
  })

  it('should prevent duplicate applications with nullifier', () => {
    // Apply once
    cy.visit('/jobs/test-job-1')
    cy.get('[data-cy=connect-wallet]').click()
    cy.get('[data-cy=midnight-wallet]').click()
    cy.get('[data-cy=apply-button]').click()
    
    // Complete application flow (abbreviated)
    cy.get('[data-cy=skill-slider-programming]').invoke('val', 85).trigger('input')
    cy.get('[data-cy=next-step]').click()
    cy.get('[data-cy=region-select]').select('US-CA')
    cy.get('[data-cy=next-step]').click()
    cy.get('[data-cy=salary-input]').type('120000')
    cy.get('[data-cy=generate-proof]').click()
    cy.get('[data-cy=submit-application]', { timeout: 15000 }).click()
    
    // Try to apply again
    cy.visit('/jobs/test-job-1')
    cy.get('[data-cy=apply-button]').should('be.disabled')
    cy.get('[data-cy=already-applied]').should('be.visible')
  })

  it('should show ineligibility for insufficient skills', () => {
    cy.visit('/jobs/senior-role')
    cy.get('[data-cy=connect-wallet]').click()
    cy.get('[data-cy=midnight-wallet]').click()
    cy.get('[data-cy=apply-button]').click()
    
    // Set insufficient skills
    cy.get('[data-cy=skill-slider-programming]').invoke('val', 30).trigger('input')
    cy.get('[data-cy=skill-slider-rust]').invoke('val', 20).trigger('input')
    cy.get('[data-cy=next-step]').click()
    
    cy.get('[data-cy=region-select]').select('US-CA')
    cy.get('[data-cy=next-step]').click()
    
    cy.get('[data-cy=salary-input]').type('120000')
    cy.get('[data-cy=generate-proof]').click()
    
    // Should show ineligibility
    cy.get('[data-cy=proof-ineligible]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-cy=eligibility-reasons]').should('contain', 'skill')
  })

  it('should filter jobs by skills and location', () => {
    cy.visit('/jobs')
    
    // Apply skill filter
    cy.get('[data-cy=skill-filter]').type('rust')
    cy.get('[data-cy=apply-filters]').click()
    cy.get('[data-cy=job-card]').should('contain', 'Rust')
    
    // Apply region filter
    cy.get('[data-cy=region-filter]').select('US-CA')
    cy.get('[data-cy=apply-filters]').click()
    
    // Apply salary range filter
    cy.get('[data-cy=salary-min]').type('100000')
    cy.get('[data-cy=salary-max]').type('150000')
    cy.get('[data-cy=apply-filters]').click()
    
    cy.get('[data-cy=job-card]').should('exist')
    cy.get('[data-cy=filter-results-count]').should('be.visible')
  })

  it('should demonstrate privacy score calculation', () => {
    cy.visit('/jobs/test-job-1')
    cy.get('[data-cy=connect-wallet]').click()
    cy.get('[data-cy=midnight-wallet]').click()
    cy.get('[data-cy=apply-button]').click()
    
    // Maximum privacy (no data revealed)
    cy.get('[data-cy=skill-slider-programming]').invoke('val', 85).trigger('input')
    cy.get('[data-cy=next-step]').click()
    cy.get('[data-cy=region-select]').select('US-CA')
    cy.get('[data-cy=privacy-toggle]').check() // Keep location private
    cy.get('[data-cy=next-step]').click()
    cy.get('[data-cy=salary-input]').type('120000')
    cy.get('[data-cy=salary-private]').check() // Keep salary private
    
    cy.get('[data-cy=privacy-preview]').should('contain', '100%')
    
    // Reveal some data and check score decrease
    cy.get('[data-cy=salary-private]').uncheck()
    cy.get('[data-cy=privacy-preview]').should('not.contain', '100%')
    
    cy.get('[data-cy=generate-proof]').click()
    cy.get('[data-cy=final-privacy-score]', { timeout: 10000 }).should('be.visible')
  })
})
