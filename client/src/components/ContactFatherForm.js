import React, { useState } from 'react';

function ContactFatherForm({ clergyName, clergyId }) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.name || !formData.phoneNumber || !formData.message) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact-clergy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clergyName,
          clergyId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Your message has been sent successfully!');
        setFormData({ name: '', phoneNumber: '', message: '' });
      } else {
        setError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-700">
      <h3 className="text-lg font-semibold text-green-700 mb-4">
        Contact This Father
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Your Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="123-456-7890"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your message..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-semibold disabled:bg-gray-400"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default ContactFatherForm;
