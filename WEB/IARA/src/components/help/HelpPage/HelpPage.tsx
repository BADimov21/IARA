/**
 * Help Page Component
 * Comprehensive guide for users explaining all system features
 */

import React from 'react';
import { Card } from '../../shared';
import './HelpPage.css';

export const HelpPage: React.FC = () => {
  return (
    <div className="help-page">
      <div className="help-header">
        <h1>🎣 IARA Fishing System - User Guide</h1>
        <p>Welcome to Bulgaria's Integrated Fisheries Administration System</p>
      </div>

      <div className="help-content">
        {/* Getting Started */}
        <Card className="help-section">
          <h2>🚀 Getting Started</h2>
          <ol>
            <li><strong>Create an Account:</strong> Register with your email and password</li>
            <li><strong>Complete Your Profile:</strong> Fill in your personal information including your EGN (Единен граждански номер)</li>
            <li><strong>Purchase a Ticket:</strong> Buy a recreational fishing ticket to start fishing legally</li>
            <li><strong>Record Your Catches:</strong> Log all fish you catch to help maintain sustainable fishing</li>
          </ol>
        </Card>

        {/* Fishing Tickets */}
        <Card className="help-section">
          <h2>🎫 Fishing Tickets</h2>
          
          <h3>What are Fishing Tickets?</h3>
          <p>
            Fishing tickets (билети за любителски риболов) are required permits for recreational fishing in Bulgaria. 
            Each ticket type has different validity periods and costs.
          </p>

          <h3>Types of Tickets:</h3>
          <ul>
            <li><strong>Daily Ticket:</strong> Valid for 1 day - Best for occasional fishing trips</li>
            <li><strong>Weekly Ticket:</strong> Valid for 7 days - Good for short fishing vacations</li>
            <li><strong>Monthly Ticket:</strong> Valid for 30 days - Popular for regular fishermen</li>
            <li><strong>Annual Ticket:</strong> Valid for 365 days - Most economical for frequent fishing</li>
          </ul>

          <h3>How to Purchase:</h3>
          <ol>
            <li>Go to "My Tickets" in the navigation menu</li>
            <li>Click "🎫 Purchase New Ticket"</li>
            <li>Select the ticket type that suits your needs</li>
            <li>Choose your validity dates</li>
            <li>Complete the purchase</li>
          </ol>

          <div className="help-tip">
            <strong>💡 Tip:</strong> The system automatically calculates the expiration date based on the ticket type you select!
          </div>
        </Card>

        {/* Recording Catches */}
        <Card className="help-section">
          <h2>🐟 Recording Your Catches</h2>
          
          <h3>Why Record Catches?</h3>
          <p>
            Recording your catches helps fisheries management track fish populations, maintain sustainable fishing practices, 
            and ensure healthy fish stocks for future generations.
          </p>

          <h3>When to Record:</h3>
          <ul>
            <li>Record catches <strong>immediately</strong> after each fishing trip</li>
            <li>You must have a valid ticket for the date you fished</li>
            <li>Be accurate with species identification and quantities</li>
          </ul>

          <h3>How to Record a Catch:</h3>
          <ol>
            <li>Navigate to "My Catches"</li>
            <li>Click "📝 Record New Catch"</li>
            <li>Select the ticket you used (must be valid for that date)</li>
            <li>Choose the fish species you caught</li>
            <li>Enter the quantity caught</li>
            <li>Specify the catch date</li>
            <li>Submit your record</li>
          </ol>

          <div className="help-warning">
            <strong>⚠️ Important:</strong> Failing to record catches accurately may result in penalties and can harm fish conservation efforts.
          </div>
        </Card>

        {/* Understanding EGN */}
        <Card className="help-section">
          <h2>🆔 About Your EGN</h2>
          
          <h3>What is an EGN?</h3>
          <p>
            EGN (Единен граждански номер - Unified Civil Number) is your unique 10-digit personal identification number 
            assigned to all Bulgarian citizens and residents.
          </p>

          <h3>Why is it Required?</h3>
          <ul>
            <li>Legal requirement for fishing permits and tickets</li>
            <li>Links all your fishing activities to your identity</li>
            <li>Enables enforcement of fishing regulations</li>
            <li>Required by Bulgarian fisheries law</li>
          </ul>

          <h3>EGN Format:</h3>
          <p>
            Your EGN consists of 10 digits in the format: YYMMDDXXXC
          </p>
          <ul>
            <li><strong>YY:</strong> Last two digits of birth year</li>
            <li><strong>MM:</strong> Month of birth (for 1900s) or +40 (for 2000s)</li>
            <li><strong>DD:</strong> Day of birth</li>
            <li><strong>XXX:</strong> Sequential number</li>
            <li><strong>C:</strong> Check digit</li>
          </ul>

          <div className="help-example">
            <strong>Example:</strong> 9001011234 represents someone born on January 1, 1990
          </div>
        </Card>

        {/* Fish Species Information */}
        <Card className="help-section">
          <h2>🔍 Fish Species Information</h2>
          
          <p>
            The system contains a database of fish species found in Bulgarian waters. You can browse this information 
            to help identify your catches correctly.
          </p>

          <h3>How to Browse Species:</h3>
          <ol>
            <li>Go to "View Information" → "Fish Species" in the menu</li>
            <li>Browse the list of available species</li>
            <li>Use this information when recording your catches</li>
          </ol>

          <h3>Common Species in Bulgaria:</h3>
          <ul>
            <li><strong>Carp (Шаран):</strong> Most popular freshwater fish</li>
            <li><strong>Pike (Щука):</strong> Predatory freshwater fish</li>
            <li><strong>Trout (Пъстърва):</strong> Found in mountain streams</li>
            <li><strong>Catfish (Сом):</strong> Large bottom-dwelling fish</li>
            <li><strong>Perch (Костур):</strong> Common in rivers and lakes</li>
          </ul>
        </Card>

        {/* Fishing Permits (for commercial) */}
        <Card className="help-section">
          <h2>📋 Fishing Permits</h2>
          
          <p>
            <strong>Note:</strong> Fishing permits are different from fishing tickets. Permits are typically for 
            commercial fishing operations or special fishing activities.
          </p>

          <h3>Regular Users:</h3>
          <p>
            If you're fishing recreationally (for sport/leisure), you only need a <strong>fishing ticket</strong>, 
            not a permit. Permits are for:
          </p>
          <ul>
            <li>Commercial fishing vessels</li>
            <li>Professional fishermen</li>
            <li>Special fishing operations</li>
            <li>Research and scientific purposes</li>
          </ul>
        </Card>

        {/* Rules and Regulations */}
        <Card className="help-section">
          <h2>⚖️ Fishing Rules & Regulations</h2>
          
          <h3>General Rules:</h3>
          <ul>
            <li><strong>Valid Ticket Required:</strong> Must have a valid fishing ticket for the date you fish</li>
            <li><strong>Catch Limits:</strong> Respect daily catch limits for each species</li>
            <li><strong>Size Restrictions:</strong> Some species have minimum size requirements</li>
            <li><strong>Protected Periods:</strong> Certain species cannot be caught during spawning seasons</li>
            <li><strong>Protected Areas:</strong> Some waters are off-limits or have special restrictions</li>
            <li><strong>Gear Restrictions:</strong> Only approved fishing gear may be used for recreational fishing</li>
          </ul>

          <h3>Best Practices:</h3>
          <ul>
            <li>Practice catch and release when possible</li>
            <li>Handle fish carefully to minimize harm</li>
            <li>Respect private property and other anglers</li>
            <li>Keep fishing areas clean - take your trash with you</li>
            <li>Report any pollution or illegal fishing activities</li>
          </ul>

          <div className="help-warning">
            <strong>⚠️ Violations:</strong> Fishing without a valid ticket, exceeding catch limits, or catching protected 
            species can result in significant fines and legal consequences.
          </div>
        </Card>

        {/* Privacy & Data */}
        <Card className="help-section">
          <h2>🔒 Privacy & Data Security</h2>
          
          <h3>How We Protect Your Information:</h3>
          <ul>
            <li>All personal data is encrypted and securely stored</li>
            <li>Your EGN and personal information are only used for fishing administration</li>
            <li>Data is protected in compliance with Bulgarian and EU privacy laws (GDPR)</li>
            <li>Access to your information is strictly controlled</li>
          </ul>

          <h3>Who Can See Your Data:</h3>
          <ul>
            <li><strong>You:</strong> Full access to your own records</li>
            <li><strong>Fisheries Inspectors:</strong> Can view your tickets and catches during inspections</li>
            <li><strong>System Administrators:</strong> Limited access for technical support only</li>
            <li><strong>Government Authorities:</strong> Only for regulatory compliance and law enforcement</li>
          </ul>
        </Card>

        {/* Support & Help */}
        <Card className="help-section">
          <h2>💬 Getting Help</h2>
          
          <h3>Having Trouble?</h3>
          <p>If you encounter any issues or have questions:</p>
          <ul>
            <li>Check this help guide first</li>
            <li>Review the information boxes on each page (blue boxes with ℹ️ icons)</li>
            <li>Contact your local fisheries administration office</li>
            <li>For technical issues, contact system support</li>
          </ul>

          <h3>Quick Troubleshooting:</h3>
          <dl>
            <dt><strong>Can't purchase a ticket:</strong></dt>
            <dd>Make sure you've completed your personal information including your EGN</dd>

            <dt><strong>Can't record a catch:</strong></dt>
            <dd>You need a valid fishing ticket first. Purchase a ticket before recording catches.</dd>

            <dt><strong>Forgot which ticket to select:</strong></dt>
            <dd>View your tickets in "My Tickets" - the system shows valid dates for each ticket</dd>

            <dt><strong>Don't know the fish species:</strong></dt>
            <dd>Browse "Fish Species" in the View Information menu to identify your catch</dd>
          </dl>
        </Card>

        {/* Sustainability */}
        <Card className="help-section">
          <h2>🌱 Supporting Sustainable Fishing</h2>
          
          <p>
            By using this system and accurately recording your fishing activities, you're contributing to:
          </p>
          <ul>
            <li><strong>Fish Population Monitoring:</strong> Helps scientists track fish stocks</li>
            <li><strong>Ecosystem Health:</strong> Data supports healthy aquatic ecosystems</li>
            <li><strong>Future Generations:</strong> Ensures fishing opportunities for your children and grandchildren</li>
            <li><strong>Sustainable Management:</strong> Enables evidence-based fishing regulations</li>
            <li><strong>Conservation Efforts:</strong> Protects endangered and vulnerable species</li>
          </ul>

          <div className="help-tip">
            <strong>🌍 Remember:</strong> Today's conservation is tomorrow's abundance. Fish responsibly!
          </div>
        </Card>
      </div>
    </div>
  );
};
